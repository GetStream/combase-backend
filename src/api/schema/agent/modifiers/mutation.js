import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { getTokenPayload } from 'utils/auth';
import { deepmerge } from 'graphql-compose';
import { OrganizationTC } from 'api/schema/organization/model';

import { streamCtx } from 'utils/streamCtx';
import { syncChatProfile } from 'utils/resolverMiddlewares/streamChat';
import { addMeiliDocument, updateMeiliDocument } from 'utils/resolverMiddlewares/search';

const searchableFields = ['_id', 'name', 'role', 'email', 'timezone', 'organization'];

export const agentCreate = tc =>
	tc.mongooseResolvers
		.createOne()
		.wrapResolve(next => async rp => {
			if (!rp.context.organization) {
				throw new Error('Unauthorized.');
			}

			// Creates the agent in Mongo
			// eslint-disable-next-line callback-return
			const data = await next(rp);

			// Syncs the Agent doc to StreamChat and MeiliSearch.
			try {
				const { stream, meilisearch } = rp.context;
				const { _doc } = data.record;

				await stream.chat.upsertUser({
					avatar: _doc.avatar,
					email: _doc.email,
					role: _doc.access,
					id: _doc._id.toString(),
					name: _doc.name.display,
					organization: _doc.organization.toString(),
					timezone: _doc.timezone,
					entity: tc.getTypeName(),
				});

				await meilisearch.index('agent').addDocuments([_doc]);

				return data;
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(error.message);

				return data;
			}
		})
		.withMiddlewares([addMeiliDocument('agent', searchableFields)])
		.clone({ name: 'create' });

export const agentUpdate = tc =>
	tc.mongooseResolvers
		.updateById()
		.withMiddlewares([syncChatProfile('Agent'), updateMeiliDocument('agent', searchableFields)])
		.clone({ name: 'update' });

export const agentDeactivate = tc =>
	tc.mongooseResolvers
		.updateById()
		.wrap(resolver => {
			resolver.removeArg('record');

			return resolver;
		})
		.wrapResolve(next => rp => {
			// eslint-disable-next-line no-param-reassign
			rp.args = deepmerge(rp.args, { record: { active: false } });

			return next(rp);
		})
		.clone({ name: 'deactivate' });

export const agentActivate = tc =>
	tc.mongooseResolvers
		.updateById()
		.wrap(resolver => {
			resolver.removeArg('record');

			return resolver;
		})
		.wrapResolve(next => rp => {
			// eslint-disable-next-line no-param-reassign
			rp.args = deepmerge(rp.args, { record: { active: true } });

			return next(rp);
		})
		.clone({ name: 'activate' });

export const agentLogin = tc =>
	tc.mongooseResolvers
		.findOne()
		.removeArg('record')
		.addArgs({
			email: 'String!',
			password: 'String!',
		})
		.wrapResolve(next => async rp => {
			// eslint-disable-next-line callback-return
			const data = await next(
				deepmerge(rp, {
					args: {
						filter: {
							email: rp.args.email,
						},
					},
					projection: {
						_id: true,
						organization: true,
						password: true,
					},
				})
			);

			if (!data) {
				throw new Error('User not found.');
			}

			const valid = await bcrypt.compare(rp.args.password, data?.password);

			if (!valid) {
				throw new Error('Incorrect password');
			}

			delete data.password;
			data.token = jwt.sign(getTokenPayload(data, 'agent'), process.env.AUTH_SECRET);

			return data;
		})
		.clone({ name: 'login' });

export const onboard = tc =>
	tc.schemaComposer.createResolver({
		name: 'onboard',
		type: tc,
		kind: 'mutation',
		args: {
			agent: tc.getInputTypeComposer().makeFieldNullable('organization'),
			organization: OrganizationTC.getInputType(),
		},
		resolve: async rp => {
			const { args } = rp;

			const streamContext = streamCtx(args.organization.stream.key, args.organization.stream.secret, args.organization.stream.appId);

			const { record: orgDoc } = await tc.schemaComposer
				.getOTC('Organization')
				.getResolver('create')
				.resolve(
					deepmerge(rp, {
						args: {
							record: args.organization,
						},
						context: {
							stream: streamContext,
						},
					})
				);

			const { record: agentDoc } = await tc.getResolver('create').resolve(
				deepmerge(rp, {
					args: {
						record: {
							...args.agent,
							organization: orgDoc._id,
						},
					},
					context: {
						stream: streamContext,
					},
				})
			);

			const token = jwt.sign(getTokenPayload(agentDoc._doc, 'agent'), process.env.AUTH_SECRET);

			return {
				...agentDoc._doc,
				token,
			};
		},
	});
