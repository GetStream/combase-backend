export const assetCreate = tc => tc.mongooseResolvers.createOne().clone({ name: 'create' });
export const assetUpdate = tc => tc.mongooseResolvers.updateById().clone({ name: 'update' });
export const assetRemove = tc => tc.mongooseResolvers.removeById().clone({ name: 'remove' });
export const assetRemoveMany = tc => tc.mongooseResolvers.removeMany().clone({ name: 'removeMany' });
