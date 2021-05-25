export const extend = tc => {
	const IntegrationDefinitionTC = tc.schemaComposer.getOTC('IntegrationDefinition');

	tc.addFields({
		parentDefinition: {
			type: IntegrationDefinitionTC,
			projection: {
				uid: true,
			},
			resolve: (source, _, context, info) => {
				const { uid: id } = source;

				const args = {
					id,
				};

				return IntegrationDefinitionTC.getResolver('get').resolve({
					source,
					args,
					context,
					info,
				});
			},
		},
	});
};
