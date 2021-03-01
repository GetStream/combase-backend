export const organizationUpdate = tc => tc.mongooseResolvers.updateById().clone({ name: 'update' });
// TODO: destroy org resolver
