import { deepmerge } from 'graphql-compose';

export const ticket = tc => tc.mongooseResolvers.findById().clone({ name: 'get' });

export const tickets = tc =>
	tc.mongooseResolvers
		.connection({
			name: 'list',
			findManyOpts: {
				filter: {
					operators: true,
				},
			},
		})
		.wrapResolve(next => rp => {
			if (rp.context.access !== 'super_admin' && rp.context.access !== 'admin') {
				// eslint-disable-next-line no-param-reassign
				rp.args = deepmerge(rp.args, {
					filter: {
						_operators: {
							agents: {
								in: [rp.context.agent],
							},
						},
					},
				});
			}

			return next(rp);
		})
		.clone({ name: 'list' });
