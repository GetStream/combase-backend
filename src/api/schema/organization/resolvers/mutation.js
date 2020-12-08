import { generateMockAgentsAndGroups } from 'utils/mockData';

export const createMockAgentData = {
	name: 'createMockAgentData',
	kind: 'mutation',
	type: 'Organization',
	args: {
		domain: 'String',
	},
	resolve: async (_, { domain }, { models: { Agent, Group, Organization }, organization, stream }) => {
		try {
			if (!organization) return null;

			const groupCount = await Group.countDocuments({ organization });
			const agentCount = await Agent.countDocuments({ organization });

			if (groupCount || agentCount) {
				throw new Error('Please use a fresh Organization, with no existing groups or agents.');
			}

			await generateMockAgentsAndGroups(
				{
					domain,
					organization,
				},
				Group,
				Agent,
				stream
			);

			return Organization.findById(organization);
		} catch (error) {
			throw new Error(error.message);
		}
	},
};
