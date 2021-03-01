export const webhookCreate = tc => tc.mongooseResolvers.createOne().clone({ name: 'create' });
export const webhookUpdate = tc => tc.mongooseResolvers.updateById().clone({ name: 'update' });
export const webhookRemove = tc => tc.mongooseResolvers.removeById().clone({ name: 'remove' });
export const webhookRemoveMany = tc => tc.mongooseResolvers.removeMany().clone({ name: 'removeMany' });
