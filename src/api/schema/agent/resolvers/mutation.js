import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { getTokenPayload } from 'utils/auth';
import { StreamChat } from 'stream-chat';
import { connect as streamFeedsClient } from 'getstream';

import { OrganizationTC } from '../../organization/model';
import { AgentTC } from '../model';

export const loginAgent = {
	name: 'loginAgent',
	type: AgentTC,
	kind: 'mutation',
	args: {
		email: 'String!',
		password: 'String!',
	},
	resolve: async (_, { email, password }, { models: { Agent } }) => {
		if (!email || !password) {
			throw new Error('Missing arguments.');
		}

		const agent = await Agent.findOne({ email });

		if (!agent) {
			throw new Error('Account does not exist.');
		}

		const validate = await agent.verifyPassword(password);

		if (!validate) {
			throw new Error('Incorrect password.');
		}

		const token = jwt.sign(getTokenPayload(agent._doc), process.env.AUTH_SECRET);

		return {
			...agent._doc,
			token,
		};
	},
};

export const createAgent = {
	name: 'createAgent',
	type: AgentTC,
	kind: 'mutation',
	args: {
		agent: AgentTC.getInputTypeComposer().makeFieldNullable('organization'),
	},
	resolve: async (_, args, { agents, models: { Agent }, stream, organization }) => {
		if (!organization && !agents) {
			throw new Error('Unauthorized');
		}

		const agent = await Agent.create({
			...args.agent,
			organization,
		});

		await stream.chat.setUser({
			avatar: agent._doc.avatar,
			email: agent._doc.email,
			id: agent._id.toString(),
			name: agent._doc.name.display,
			organization: organization.toString(),
			entity: 'Agent',
		});

		const token = jwt.sign(getTokenPayload(agent._doc), process.env.AUTH_SECRET);

		return {
			...agent._doc,
			token,
		};
	},
};

/**
 * Below we modify the AgentInput type on the fly for this one resolver
 * to allow a null/undefined organization value, as this resolver will
 * enrich the agent with the created org ID before it runs agentCreateOne.
 */
export const createAgentAndOrganization = {
	name: 'createAgentAndOrganization',
	type: AgentTC,
	kind: 'mutation',
	args: {
		agent: AgentTC.getInputTypeComposer().makeFieldNullable('organization'),
		organization: OrganizationTC.getInputType(),
	},
	resolve: async (_, args, { models: { Agent, Organization } }) => {
		const { _id } = await Organization.create(args.organization);

		const agent = {
			...args.agent,
			organization: _id,
		};

		const agentDoc = await Agent.create(agent);

		const chat = new StreamChat(args.organization.stream.key, args.organization.stream.secret);
		const feeds = streamFeedsClient(args.organization.stream.key, args.organization.stream.secret);

		await chat.setUser({
			avatar: agentDoc._doc.avatar,
			email: agentDoc._doc.email,
			id: agentDoc._id.toString(),
			name: agentDoc._doc.name.display,
			organization: _id.toString(),
			entity: 'Agent',
		});

		await feeds.feed('organization', _id.toString()).follow('agent', agentDoc._id.toString());

		const token = jwt.sign(getTokenPayload(agentDoc._doc), process.env.AUTH_SECRET);

		return {
			...agentDoc._doc,
			token,
		};
	},
};
