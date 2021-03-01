export const extend = tc => {
	tc.addFields({
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
};
