export const ticket = tc => tc.mongooseResolvers.findById().clone({ name: 'get' });

export const ticketFind = tc => tc.mongooseResolvers.findOne().clone({ name: 'find' });

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
		.clone({ name: 'list' });

export const search = tc => tc.algoliaResolvers.search();
