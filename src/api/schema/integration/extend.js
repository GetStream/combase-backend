import schemaComposer from 'api/schema/composer';

export const IntegrationFilterITC = schemaComposer.createInputTC({
	name: 'IntegrationFilterInput',
	fields: {
		id: 'String',
		name: 'String',
	},
});

export const IntegrationTC = schemaComposer.createObjectTC({
	name: 'Integration',
	fields: {
		configuration: 'JSON!',
		id: 'String!',
		fields: 'JSON!',
		name: 'String!',
		triggers: 'JSON!',
		internal: {
			type: schemaComposer.createObjectTC({
				name: 'IntegrationInternal',
				fields: {
					name: 'String!',
					hash: 'String',
					path: 'String!',
					version: 'String',
				},
			}),
		},
	},
});
