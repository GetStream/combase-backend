import { OrganizationTC } from '../model';

export const organization = {
	name: 'organization',
	description: 'Get the organization for the currently authenticated user.',
	type: OrganizationTC,
	kind: 'query',
	args: {},
	resolve: (_, __, { agent, organization: orgId, models: { Organization } }) => {
		if (!agent || !orgId) {
			throw new Error('Unauthorized');
		}

		return Organization.findById(orgId).lean();
	},
};
