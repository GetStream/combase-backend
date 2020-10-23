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
