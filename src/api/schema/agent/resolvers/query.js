import { AgentTC } from '../model';

/**
 *! Always used named exports in resolver files.
 * export const resolverName = () => {};
 */

export const me = {
	name: 'me',
	type: AgentTC,
	kind: 'query',
	args: {},
	resolve: (_, __, { agent, models: { Agent } }) => {
		if (!agent) {
			throw new Error('Unauthorized');
		}

		return Agent.findById(agent, { password: false }).lean();
	},
};

export const agentTimeline = {
	name: 'agentTimeline',
	type: 'StreamFeed',
	kind: 'query',
	args: {},
	resolve: ({ _id }, _, { stream: { feeds } }) => feeds.feed('agent', _id).get(),
};
