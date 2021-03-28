import { createAddTagResolver, createRemoveTagResolver } from 'utils/createTaggableEntity';

export const groupCreate = tc => tc.mongooseResolvers.createOne().clone({ name: 'create' });
export const groupUpdate = tc => tc.mongooseResolvers.updateById().clone({ name: 'update' });
export const groupRemove = tc => tc.mongooseResolvers.removeById().clone({ name: 'remove' });
export const groupRemoveMany = tc => tc.mongooseResolvers.removeMany().clone({ name: 'removeMany' });

export const groupAddTag = tc => createAddTagResolver(tc);

export const groupRemoveTag = tc => createRemoveTagResolver(tc);
