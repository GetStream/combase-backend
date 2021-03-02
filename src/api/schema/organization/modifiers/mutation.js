import { OrganizationModel } from 'api/schema/organization/model';

export const organizationUpdate = tc => tc.mongooseResolvers.updateById().clone({ name: 'update' });

// TODO: destroy org resolver
export const organizationCreateApiCredentials = tc =>
	tc.schemaComposer.createResolver({
		name: 'createApiCredentials',
		type: tc,
		kind: 'mutation',
		args: {
			name: 'String!',
			scope: 'EnumOrganizationSecretsScope',
		},
		resolve: ({ args, context }) => {
			if (!context?.organization) {
				throw new Error('Unauthorized');
			}

			return OrganizationModel.findByIdAndUpdate(context?.organization, { $addToSet: { secrets: args } }, { new: true });
		},
	});
