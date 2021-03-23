export const tag = tc =>
	tc.mongooseResolvers
		.findOne()
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
		.wrapResolve(next => rp => {
			const { organization } = rp.context;

			if (!organization) {
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
		.clone({ name: 'get' });

export const tags = tc => tc.mongooseResolvers.connection().clone({ name: 'list' });
