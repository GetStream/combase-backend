import 'dotenv/config';
import bcrypt from 'bcrypt';
import { StreamChat } from 'stream-chat';
import { connect as streamFeedsClient } from 'getstream';
import jwt from 'jsonwebtoken';

import { getTokenPayload } from 'utils/auth';
import { deepmerge } from 'graphql-compose';
import { OrganizationModel, OrganizationTC } from 'api/schema/organization/model';

import { AgentModel } from '../model';

export const agentCreate = tc =>
	tc.mongooseResolvers
		.createOne()
		.wrapResolve(next => async rp => {
			try {
				// eslint-disable-next-line callback-return
				const data = await next(rp);

				const { stream } = rp.context;
				const { _doc } = data.record;

				await stream.chat.upsertUser({
					avatar: _doc.avatar,
					email: _doc.email,
					id: _doc._id.toString(),
					name: _doc.name.display,
					organization: _doc.organization.toString(),
					timezone: _doc.timezone,
					entity: 'Agent',
				});

				return data;
			} catch (error) {
				// eslint-disable-next-line no-console
				console.log('FAILED TO CREATED AGNE STREAM USER', error.message);
			}
		})
		.clone({ name: 'create' });
export const agentUpdate = tc => tc.mongooseResolvers.updateById().clone({ name: 'update' });

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
				throw new Error('Unauthorized');
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
		resolve: async ({ args }) => {
			const { _id } = await OrganizationModel.create(args.organization);

			const agent = {
				...args.agent,
				organization: _id,
			};

			const agentDoc = await AgentModel.create(agent);

			const chat = new StreamChat(args.organization.stream.key, args.organization.stream.secret);
			const feeds = streamFeedsClient(args.organization.stream.key, args.organization.stream.secret);

			await chat.upsertUser({
				avatar: agentDoc._doc.avatar,
				email: agentDoc._doc.email,
				id: agentDoc._id.toString(),
				name: agentDoc._doc.name.display,
				organization: _id.toString(),
				entity: 'Agent',
			});

			await feeds.feed('organization', _id.toString()).follow('agent', agentDoc._id.toString());

			const token = jwt.sign(getTokenPayload(agentDoc._doc, 'agent'), process.env.AUTH_SECRET);

			return {
				...agentDoc._doc,
				token,
			};
		},
	});
