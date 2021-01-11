import { IntegrationTC, IntegrationFilterITC } from './extend';

export const integrations = {
	name: 'integrations',
	kind: 'query',
	type: [IntegrationTC],
	args: { filter: IntegrationFilterITC },
	resolve: (_, args, { integrationManifest }) => {
		const filter = Object.entries(args?.filter || {});

		if (filter?.length) {
			return integrationManifest.filter(original => filter.some(([key, value]) => original[key] === value));
		}

		return integrationManifest;
	},
};

export const integration = {
	name: 'integration',
	kind: 'query',
	type: IntegrationTC,
	args: {
		id: 'String',
	},
	resolve: (_, args, { integrationManifest }) => integrationManifest.find(original => original.id === args.id),
};
