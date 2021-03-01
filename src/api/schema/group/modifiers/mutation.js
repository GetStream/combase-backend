export const groupCreate = tc => tc.mongooseResolvers.createOne().clone({ name: 'create' });
export const groupUpdate = tc => tc.mongooseResolvers.updateOne().clone({ name: 'update' });
export const groupRemove = tc => tc.mongooseResolvers.removeOne().clone({ name: 'remove' });
export const groupRemoveMany = tc => tc.mongooseResolvers.removeMany().clone({ name: 'removeMany' });
