import './extend';

import resolvers from './resolvers';
import { IntegrationTC } from './model';

const Query = {
	integrationById: IntegrationTC.mongooseResolvers.findById(),
	integrationMany: IntegrationTC.mongooseResolvers.findMany(),
	...resolvers.Query,
};

const Mutation = {
	integrationCreate: IntegrationTC.mongooseResolvers.createOne(),
	integrationUpdateById: IntegrationTC.mongooseResolvers.updateById(),
	integrationRemoveById: IntegrationTC.mongooseResolvers.removeById(),
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
