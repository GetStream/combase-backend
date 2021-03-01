import p from 'phin';
import { IntegrationDefinitionFilterITC } from '../../model';

export const integrationDefinition = tc =>
	tc.schemaComposer.createResolver({
		name: 'get',
		kind: 'query',
		type: tc,
		args: {
			id: 'String',
		},
		resolve: (_, args, { integrationManifest }) => integrationManifest.find(original => original.id === args.id),
	});

export const integrationDefinitions = tc =>
	tc.schemaComposer.createResolver({
		name: 'list',
		kind: 'query',
		type: [tc],
		args: { filter: IntegrationDefinitionFilterITC },
		resolve: async (_, args) => {
			const filter = Object.entries(args?.filter || {});
			const { body: integrationManifest } = await p({
				method: 'GET',
				parse: 'json',
				timeout: 2000,
				url: `${process.env.INGRESS_URL}/integration-definitions`,
			});

			if (filter?.length) {
				return integrationManifest.filter(original => filter.some(([key, value]) => original[key] === value));
			}

			return integrationManifest;
		},
	});
