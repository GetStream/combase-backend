/**
 *! Always used named exports in resolver files.
 * export const resolverName = () => {};
 */

export const me = {
	name: 'me',
	type: 'Agent!',
	kind: 'query',
	args: {},
	resolve: (_, __, { agent, models: { Agent } }) => {
		if (!agent) {
			throw new Error('Unauthorized');
		}

		return Agent.findById(agent, { password: false }).lean();
	},
};

export const agents = {
	name: 'agents',
	description: 'Get all agents for the authenticated organization',
	type: '[Agent!]',
	kind: 'query',
	args: {},
	resolve: (_, __, { models: { Agent }, organization }) => {
		try {
			if (!organization) {
				throw new Error('Unauthorized');
			}

			return Agent.find({ organization });
		} catch (error) {
			throw new Error(error.message);
		}
	},
};
