import './extend';

import resolvers from './resolvers';
import { IntegrationTC } from './model';

const Query = {
	ticketById: IntegrationTC.mongooseResolvers.findById(),
	ticketByIds: IntegrationTC.mongooseResolvers.findByIds(),
	ticketOne: IntegrationTC.mongooseResolvers.findOne(),
	ticketMany: IntegrationTC.mongooseResolvers.findMany(),
	ticketCount: IntegrationTC.mongooseResolvers.count(),
	...resolvers.Query,
};

const Mutation = {
	ticketCreateOne: IntegrationTC.mongooseResolvers.createOne(),
	ticketCreateMany: IntegrationTC.mongooseResolvers.createMany(),
	ticketUpdateById: IntegrationTC.mongooseResolvers.updateById(),
	ticketUpdateOne: IntegrationTC.mongooseResolvers.updateOne(),
	ticketUpdateMany: IntegrationTC.mongooseResolvers.updateMany(),
	ticketRemoveById: IntegrationTC.mongooseResolvers.removeById(),
	ticketRemoveOne: IntegrationTC.mongooseResolvers.removeOne(),
	ticketRemoveMany: IntegrationTC.mongooseResolvers.removeMany(),
	...resolvers.Mutation,
};

const Subscription = {
	...resolvers.Subscription,
};

export default {
	Query,
	Mutation,
	Subscription,
};
