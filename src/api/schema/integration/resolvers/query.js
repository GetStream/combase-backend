import { IntegrationDefinitionTC, IntegrationDefinitionFilterITC } from '../model';

export const integrationDefinitions = {
	name: 'integrationDefinitions',
	kind: 'query',
	type: [IntegrationDefinitionTC],
	args: { filter: IntegrationDefinitionFilterITC },
	resolve: (_, args, { integrationManifest }) => {
		const filter = Object.entries(args?.filter || {});

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
