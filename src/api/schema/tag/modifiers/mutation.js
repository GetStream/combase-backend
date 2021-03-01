export const tagCreate = tc => tc.mongooseResolvers.createOne().clone({ name: 'create' });
export const tagUpdate = tc => tc.mongooseResolvers.updateById().clone({ name: 'update' });
export const tagRemove = tc => tc.mongooseResolvers.removeById().clone({ name: 'remove' });
export const tagRemoveMany = tc => tc.mongooseResolvers.removeMany().clone({ name: 'removeMany' });
