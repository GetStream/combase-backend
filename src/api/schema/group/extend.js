import { GroupTC } from './model';

GroupTC.addFields({
	memberCount: {
		type: 'Int!',
		args: {},
		resolve: ({ _id }, _, { models: { Agent }, organization }) =>
			Agent.countDocuments({
				groups: { $in: [_id] },
				organization,
			}),
	},
});
