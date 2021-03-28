export const faq = tc =>
	tc.mongooseResolvers
		.findOne()
		.wrap(resolver => {
			// eslint-disable-next-line no-param-reassign
			resolver.args = {
				shortId: 'String!',
			};

			return resolver;
		})
		.wrapResolve(next => rp => {
			const { shortId } = rp.args;

			// eslint-disable-next-line no-param-reassign
			rp.args = {
				filter: {
					shortId,
				},
			};

			return next(rp);
		})
		.clone({ name: 'get' });

export const faqs = tc => tc.mongooseResolvers.connection().clone({ name: 'list' });
