import { generateMockAgentsAndGroups } from 'utils/mockData';

export const createMockAgentData = {
	name: 'createMockAgentData',
	kind: 'mutation',
	type: 'Organization',
	args: { organization: 'MongoID!' },
	resolve: async (_, args, { models: { Agent, Group, Organization }, organization }) => {
		try {
			if (organization && !args.organization) return null;

			await generateMockAgentsAndGroups(args?.organization || organization, Group, Agent);

			return Organization.findById(args?.organization || organization);
		} catch (error) {}
	},
};
