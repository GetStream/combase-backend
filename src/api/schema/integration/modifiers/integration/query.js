import { IntegrationModel } from '../../model';

export const integrationLookup = tc =>
	tc.schemaComposer.createResolver({
		name: 'lookup',
		type: tc,
		args: {
			organization: 'MongoID',
			uid: 'String!',
		},
		resolve: ({ args, context }) => {
			const organization = args.organization || context.organization;

			if (!organization) {
				throw new Error('No organization provided.');
			}

			return IntegrationModel.findOne({
				organization,
				uid: args.uid,
			});
		},
	});

export const integration = tc => tc.mongooseResolvers.findById().clone({ name: 'get' });

export const integrations = tc => tc.mongooseResolvers.connection().clone({ name: 'list' });
