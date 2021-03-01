export const user = tc => tc.mongooseResolvers.findById().clone({ name: 'get' });
export const users = tc => tc.mongooseResolvers.connection().clone({ name: 'list' });
