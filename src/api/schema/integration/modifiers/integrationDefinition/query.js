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
		resolve: async ({ args }) => {
			const { body: integrationManifest } = await p({
				method: 'GET',
				parse: 'json',
				timeout: 2000,
				url: `${process.env.INGRESS_URL}/integration-definitions`,
			});

			return integrationManifest.find(original => original.id === args.id);
		},
	});

export const integrationDefinitions = tc =>
	tc.schemaComposer.createResolver({
		name: 'list',
		kind: 'query',
		type: [tc],
		args: { filter: IntegrationDefinitionFilterITC },
		resolve: async ({ args }) => {
			const filter = Object.entries(args?.filter || {});
			const { body: integrationManifest } = await p({
				method: 'GET',
				parse: 'json',
				timeout: 2000,
				url: `${process.env.INGRESS_URL}/integration-definitions`,
			});

			if (filter?.length) {
				return integrationManifest.filter(original => filter.some(([key, value]) => original[key].includes(value)));
			}

			return integrationManifest;
		},
	});
