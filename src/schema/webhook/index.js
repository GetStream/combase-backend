import resolvers from './resolvers';
import { WebhookTC } from './model';

const Query = {
	webhookById: WebhookTC.mongooseResolvers.findById,
	webhookByIds: WebhookTC.mongooseResolvers.findByIds,
	webhookOne: WebhookTC.mongooseResolvers.findOne,
	webhookMany: WebhookTC.mongooseResolvers.findMany,
	webhookCount: WebhookTC.mongooseResolvers.count,
	...resolvers.Query,
};

const Mutation = {
	webhookCreateOne: WebhookTC.mongooseResolvers.createOne,
	webhookCreateMany: WebhookTC.mongooseResolvers.createMany,
	webhookUpdateById: WebhookTC.mongooseResolvers.updateById,
	webhookUpdateOne: WebhookTC.mongooseResolvers.updateOne,
	webhookUpdateMany: WebhookTC.mongooseResolvers.updateMany,
	webhookRemoveById: WebhookTC.mongooseResolvers.removeById,
	webhookRemoveOne: WebhookTC.mongooseResolvers.removeOne,
	webhookRemoveMany: WebhookTC.mongooseResolvers.removeMany,
	...resolvers.Mutation,
};

export default {
	Query,
	Mutation,
};
