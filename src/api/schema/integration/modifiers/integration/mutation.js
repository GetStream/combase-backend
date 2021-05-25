import { IntegrationModel } from '../../model';

export const integrationCreate = tc =>
	tc.mongooseResolvers
		.createOne()
		.wrap(resolve => {
			// eslint-disable-next-line no-param-reassign
			resolve.args = {
				uid: 'String!',
				credentials: '[IntegrationCredentialsInput!]',
			};

			return resolve;
		})
		.wrapResolve(next => rp => {
			const { organization } = rp.context;
			const { uid, credentials } = rp.args;

			if (!organization) {
				throw new Error('Unauthorized');
			}

			return next({
				...rp,
				args: {
					record: {
						credentials,
						organization,
						uid,
					},
				},
			});
		})
		.clone({ name: 'create' });
export const integrationUpdate = tc => tc.mongooseResolvers.updateById().clone({ name: 'update' });
export const integrationToggle = tc =>
	tc.schemaComposer.createResolver({
		name: 'toggle',
		kind: 'mutation',
		args: {
			_id: 'MongoID!',
			enabled: 'Boolean!',
		},
		type: tc,
		resolve: ({ args }) => {
			return IntegrationModel.findByIdAndUpdate(
				args._id,
				{
					enabled: args.enabled,
				},
				{ new: true }
			);
		},
	});
export const integrationRemove = tc => tc.mongooseResolvers.removeById().clone({ name: 'remove' });
export const integrationRemoveMany = tc => tc.mongooseResolvers.removeMany().clone({ name: 'removeMany' });
