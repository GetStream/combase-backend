export const organization = tc => tc.mongooseResolvers.findById().clone({ name: 'get' });
