import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { getTokenPayload } from 'utils/auth';
import { deepmerge } from 'graphql-compose';
import { OrganizationTC } from 'api/schema/organization/model';

import { streamCtx } from 'utils/streamCtx';
import { syncChatProfile } from 'utils/resolverMiddlewares/streamChat';

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

			// Syncs the Agent doc to StreamChat
			try {
				const { stream } = rp.context;
				const { _doc } = data.record;

				await stream.chat.upsertUser({
					avatar: _doc.avatar,
					email: _doc.email,
					role: 'admin',
					id: _doc._id.toString(),
					name: _doc.name.display,
					organization: _doc.organization.toString(),
					timezone: _doc.timezone,
					entity: tc.getTypeName(),
				});
				const token = jwt.sign(getTokenPayload(_doc, 'agent'), process.env.AUTH_SECRET);

				data.token = token;

				return data;
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error(error.message);

				return data;
			}
		})
		.withMiddlewares([tc.algoliaMiddlewares.sync])
		.clone({ name: 'create' });

export const agentUpdate = tc =>
	tc.mongooseResolvers
		.updateById()
		.withMiddlewares([syncChatProfile('Agent'), tc.algoliaMiddlewares.sync])
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
							access: 'admin',
							organization: orgDoc._id,
						},
					},
					context: {
						organization: orgDoc._id,
						stream: streamContext,
					},
				})
			);

			return agentDoc._doc;
		},
	});

export const resetPassword = tc =>
	tc.mongooseResolvers
		.updateById()
		.removeArg('record')
		.addArgs({
			password: 'String!',
		})
		.wrapResolve(next => rp => {
			return next({
				...rp,
				args: {
					_id: rp.args._id,
					record: {
						password: rp.args.password,
					},
				},
			});
		})
		.clone({ name: 'resetPassword' });

export const agentRequestPasswordReset = tc =>
	tc.mongooseResolvers
		.findOne()
		.removeArg('filter')
		.addArgs({
			email: 'String!',
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
						name: true,
						email: true,
						organization: true,
					},
				})
			);

			if (!data) {
				throw new Error('User not found.');
			}

			await tc.schemaComposer
				.getOTC('Integration')
				.getResolver('action')
				.resolve({
					...rp,
					args: {
						trigger: 'email.requestPasswordReset',
						payload: data._doc,
					},
				});

			return data;
		})
		.clone({ name: 'requestPasswordReset' });
