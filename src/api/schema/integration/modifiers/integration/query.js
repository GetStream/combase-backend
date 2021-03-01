export const integration = tc => tc.mongooseResolvers.findById().clone({ name: 'get' });
export const integrations = tc => tc.mongooseResolvers.connection().clone({ name: 'list' });
