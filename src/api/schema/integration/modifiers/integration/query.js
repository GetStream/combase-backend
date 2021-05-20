import { IntegrationModel } from '../../model';

export const integrationLookup = tc =>
	tc.schemaComposer.createResolver({
		name: 'lookup',
		type: tc,
		args: {
			organization: 'MongoID!',
			triggers: '[String!]',
		},
		resolve: ({ args }) =>
			IntegrationModel.findOne({
				organization: args.organization,
				triggers: {
					$in: args.triggers,
				},
			}),
	});

export const integration = tc => tc.mongooseResolvers.findById().clone({ name: 'get' });

export const integrations = tc => tc.mongooseResolvers.connection().clone({ name: 'list' });
