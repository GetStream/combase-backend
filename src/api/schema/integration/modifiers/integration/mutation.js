export const integrationCreate = tc => tc.mongooseResolvers.createOne().clone({ name: 'create' });
export const integrationUpdate = tc => tc.mongooseResolvers.updateById().clone({ name: 'update' });
export const integrationRemove = tc => tc.mongooseResolvers.removeById().clone({ name: 'remove' });
export const integrationRemoveMany = tc => tc.mongooseResolvers.removeMany().clone({ name: 'removeMany' });
