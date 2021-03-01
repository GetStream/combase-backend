export const faqCreate = tc => tc.mongooseResolvers.createOne().clone({ name: 'create' });
export const faqUpdate = tc => tc.mongooseResolvers.updateOne().clone({ name: 'update' });
export const faqRemove = tc => tc.mongooseResolvers.removeOne().clone({ name: 'remove' });
export const faqRemoveMany = tc => tc.mongooseResolvers.removeMany().clone({ name: 'removeMany' });
