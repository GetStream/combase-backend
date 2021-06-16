export const invitation = tc => tc.mongooseResolvers.findById().clone({ name: 'get' });
