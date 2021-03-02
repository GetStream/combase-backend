export const relations = tc => {
	tc.addRelation('parentOrganization', {
		prepareArgs: {
			_id: ({ organization }) => organization.toString(),
		},
		projection: { organization: true },
		resolver: tc.schemaComposer.getOTC('Organization').mongooseResolvers.findById(),
	});
};

export const fields = tc => {
	tc.addFields({
		streamToken: {
			name: 'streamToken',
			type: 'String',
			projection: {
				_id: true,
				organization: true,
			},
			resolve: (source, _, { stream }) => {
				return stream.feeds.createUserToken(source._id?.toString?.());
			},
		},
	});
};
