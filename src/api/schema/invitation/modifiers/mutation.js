export const invitationCreate = tc => tc.mongooseResolvers.createMany().clone({ name: 'create' });

export const invitationRemove = tc => tc.mongooseResolvers.removeById().clone({ name: 'remove' });
