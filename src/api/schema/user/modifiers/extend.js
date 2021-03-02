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
			resolve: (source, _, { user, organization, stream }) => {
				if (!user || user !== source._id?.toString?.()) {
					throw new Error('Unauthorized');
				}

				if (!stream?.feeds || !organization || organization !== source.organization?.toString?.()) {
					throw new Error('Unauthorized');
				}

				return stream.feeds.createUserToken(source._id?.toString?.());
			},
		},
	});
};
