import p from 'phin';

import { IntegrationDefinitionTC, IntegrationDefinitionFilterITC } from '../model';

export const integrationDefinitions = {
	name: 'integrationDefinitions',
	kind: 'query',
	type: [IntegrationDefinitionTC],
	args: { filter: IntegrationDefinitionFilterITC },
	resolve: async (_, args) => {
		const filter = Object.entries(args?.filter || {});
		const { body: integrationManifest } = await p({
			method: 'GET',
			parse: 'json',
			timeout: 2000,
			url: `${process.env.INGRESS_URL}integration-definitions`,
		});

		if (filter?.length) {
			return integrationManifest.filter(original => filter.some(([key, value]) => original[key] === value));
		}

		return integrationManifest;
	},
};

export const integrationDefinition = {
	name: 'integrationDefinition',
	kind: 'query',
	type: IntegrationDefinitionTC,
	args: {
		id: 'String',
	},
	resolve: (_, args, { integrationManifest }) => integrationManifest.find(original => original.id === args.id),
};
