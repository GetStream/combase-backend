export const ticket = tc => tc.mongooseResolvers.findById().clone({ name: 'get' });

export const tickets = tc => tc.mongooseResolvers.connection().clone({ name: 'list' });
