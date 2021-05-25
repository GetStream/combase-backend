export const extend = tc => {
	const IntegrationTC = tc.schemaComposer.getOTC('Integration');

	tc.addFields({
		integrationData: {
			type: IntegrationTC,
			projection: {
				id: true,
			},
			resolve: (source, _, context, info) => {
				const { organization } = context;

				if (!organization) {
					throw new Error('Unauthorized.');
				}

				const { id: uid } = source;

				const args = {
					uid,
					organization,
				};

				return IntegrationTC.getResolver('lookup').resolve({
					source,
					args,
					context,
					info,
				});
			},
		},
	});
};
