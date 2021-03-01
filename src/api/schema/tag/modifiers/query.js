export const tag = tc => tc.mongooseResolvers.findById().clone({ name: 'get' });

export const tags = tc => tc.mongooseResolvers.connection().clone({ name: 'list' });
