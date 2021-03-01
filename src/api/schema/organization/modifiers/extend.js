export const extend = tc => {
	tc.removeField('stream.appId');
	tc.removeField('stream.secret');

	tc.addNestedFields({
		'stream.key': {
			type: 'String!',
			args: {},
			resolve: async (source, _, { models: { Organization }, organization }) => {
				if (!organization) {
					throw new Error('Unauthorized');
				}

				try {
					const { stream } = await Organization.findById(organization, { 'stream.key': true });

					if (source.key === stream?.key) {
						const decrypted = await Organization.findOne({ _id: organization }, { stream: true });

						return decrypted?.stream?.key;
					}

					return null;
				} catch (error) {
					throw new Error(error.message);
				}
			},
		},
	});

	tc.addRelation('availableAgents', {
		prepareArgs: {
			filter: ({ _id }) => ({
				organization: _id.toString(),
			}),
		},
		projection: { _id: true },
		resolver: () => tc.schemaComposer.getOTC('Agent').getResolver('getAvailable'),
	});
};
