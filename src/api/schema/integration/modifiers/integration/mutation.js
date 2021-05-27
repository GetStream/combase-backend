import { deepmerge } from 'graphql-compose';
import p from 'phin';
import { logger } from 'utils/logger';
import { IntegrationModel } from '../../model';

export const integrationCreate = tc =>
	tc.mongooseResolvers
		.createOne()
		.wrap(resolve => {
			// eslint-disable-next-line no-param-reassign
			resolve.args = {
				uid: 'String!',
				credentials: '[IntegrationCredentialsInput!]',
				enabled: 'Boolean',
			};

			return resolve;
		})
		.wrapResolve(next => rp => {
			const { organization } = rp.context;
			const { enabled, uid, credentials } = rp.args;

			if (!organization) {
				throw new Error('Unauthorized');
			}

			// eslint-disable-next-line no-param-reassign
			delete rp.args;

			return next(
				deepmerge(rp, {
					args: {
						record: {
							enabled,
							credentials,
							organization,
							uid,
						},
					},
				})
			);
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
				const { trigger, payload = {} } = rp?.args || {};

				if (!organization) {
					throw new Error('Unauthorized');
				}

				await p({
					method: 'post',
					timeout: 3000,
					headers: {
						'Content-Type': 'application/json',
					},
					url: `${process.env.INGRESS_URL}/webhook/?trigger=${trigger}&organization=${organization}`,
					data: JSON.stringify({
						...payload,
						timestamp: Date.now(),
					}),
				});

				return true;
			} catch (error) {
				logger.error(error.message);

				return false;
			}
		},
	});
