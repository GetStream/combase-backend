import { TagModel } from '../model';

export const tagCreate = tc =>
	tc.mongooseResolvers
		.createOne()
		.wrap(resolver => {
			// eslint-disable-next-line no-param-reassign
			resolver.args = {
				name: 'String!',
			};

			// eslint-disable-next-line no-param-reassign
			resolver.projection = {
				organization: true,
			};

			return resolver;
		})
		.wrapResolve(next => async rp => {
			const { agent, organization } = rp.context;

			if (!organization && Boolean(agent)) {
				return 'Unauthorized';
			}

			const existing = await TagModel.findOne({
				organization,
				name: rp.args.name,
			});

			if (existing) {
				return {
					record: existing,
				};
			}

			const newRp = {
				...rp,
				args: {
					record: {
						name: rp.args.name,
						organization,
					},
				},
			};

			return next(newRp);
		})
		.clone({ name: 'create' });

export const tagUpdate = tc => tc.mongooseResolvers.updateById().clone({ name: 'update' });

export const tagRemove = tc =>
	tc.mongooseResolvers
		.removeOne()
		.wrap(resolver => {
			// eslint-disable-next-line no-param-reassign
			resolver.args = {
				name: 'String!',
			};

			return resolver;
		})
		.wrapResolve(next => rp => {
			const { organization, agent } = rp.context;

			if (!organization && Boolean(agent)) {
				return 'Unauthorized';
			}

			const newRp = {
				...rp,
				args: {
					filter: {
						name: rp.args.name,
						organization,
					},
				},
			};

			return next(newRp);
		})
		.clone({ name: 'remove' });

export const tagRemoveMany = tc => tc.mongooseResolvers.removeMany().clone({ name: 'removeMany' });
