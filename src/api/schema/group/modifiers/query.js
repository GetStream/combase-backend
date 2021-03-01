export const group = tc => tc.mongooseResolvers.findById().clone({ name: 'get' });
export const groups = tc => tc.mongooseResolvers.connection().clone({ name: 'list' });
