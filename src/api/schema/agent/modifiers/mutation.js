import 'dotenv/config';
import { StreamChat } from 'stream-chat';
import { connect as streamFeedsClient } from 'getstream';
import jwt from 'jsonwebtoken';

import { getTokenPayload } from 'utils/auth';
import { deepmerge } from 'graphql-compose';
import { OrganizationModel, OrganizationTC } from 'api/schema/organization/model';

import { AgentModel } from '../model';

export const agentCreate = tc => tc.mongooseResolvers.createOne().clone({ name: 'create' });
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
	tc.schemaComposer.createResolver({
		name: 'login',
		type: tc,
		kind: 'mutation',
		args: {
			email: 'String!',
			password: 'String!',
		},
		resolve: async rp => {
			const data = await tc.mongooseResolvers.findOne().resolve(deepmerge(rp, { args: { filter: { email: rp.args.email } } }));

			// const valid = await data.verifyPassword(rp.args.password);

			/*
			 * if (!valid) {
			 * 	throw new Error('Incorrect Password.');
			 * }
			 */

			const newRp = {
				...rp,
				args: {},
				context: {
					...rp.context,
					organization: data?.organization.toString(),
					agent: data._id.toString(),
				},
			};

			return tc.getResolver('me').resolve(newRp);
		},
	});

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
