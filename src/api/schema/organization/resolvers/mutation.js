import { OrganizationTC } from '../model';

export const organizationUpdateAvailability = {
	name: 'organizationUpdateAvailability',
	type: OrganizationTC,
	kind: 'mutation',
	args: { hours: '[OrganizationHoursInput!]' },
	resolve: (_, args, { agent, models: { Organization }, organization }) => {
		if (!organization || !agent) {
			throw new Error('Unauthorized.');
		}

		return Organization.findByIdAndUpdate(organization, { hours: args.hours }, { new: true });
	},
};
