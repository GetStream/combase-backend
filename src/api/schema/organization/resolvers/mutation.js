import { generateMockAgentsAndGroups } from 'utils/mockData';

export const createMockAgentData = {
	name: 'createMockAgentData',
	kind: 'mutation',
	type: 'Organization',
	args: { organization: 'MongoID!' },
	resolve: async (_, { organization }, { models: { Agent, Group, Organization } }) => {
		try {
			if (!organization) return null;

			const groupCount = await Group.countDocuments({ organization });
			const agentCount = await Agent.countDocuments({ organization });

			if (groupCount || agentCount) {
				throw new Error('This organization already has data, so adding mock data would likely get weird 😬');
			}

			await generateMockAgentsAndGroups(organization, Group, Agent);

			return Organization.findById(organization);
		} catch (error) {
			throw new Error(error.message);
		}
	},
};
