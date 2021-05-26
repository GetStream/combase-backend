import p from 'phin';
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

export const integrationAction = tc =>
	tc.schemaComposer.createResolver({
		name: 'action',
		type: 'Boolean',
		args: {
			trigger: 'String!',
			payload: 'JSON',
		},
		kind: 'mutation',
		resolve: async rp => {
			try {
				const { organization } = rp.context;
				const { trigger, payload } = rp?.args || {};

				if (!organization) {
					throw new Error('Unauthorized');
				}

				const payloadMap = Object.entries(payload);

				console.log(payloadMap);

				await p({
					method: 'post',
					timeout: 3000,
					url: `${process.env.INGRESS_URL}/webhook/?trigger=${trigger}&organization=${organization}`,
					data: JSON.stringify({}),
				});

				return true;
			} catch (error) {
				console.log(error.message);

				return false;
			}
		},
	});
