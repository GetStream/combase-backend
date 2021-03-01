export const webhook = tc => tc.mongooseResolvers.findById().clone({ name: 'get' });

export const webhooks = tc => tc.mongooseResolvers.connection().clone({ name: 'list' });
