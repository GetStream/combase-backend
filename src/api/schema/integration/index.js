import './extend';

import resolvers from './resolvers';
import { IntegrationTC } from './model';

const Query = {
	integration: IntegrationTC.mongooseResolvers.findById(),
	integrations: IntegrationTC.mongooseResolvers.connection(),
	...resolvers.Query,
};

const Mutation = {
	integrationCreate: IntegrationTC.mongooseResolvers.createOne(),
	integrationUpdate: IntegrationTC.mongooseResolvers.updateById(),
	integrationRemove: IntegrationTC.mongooseResolvers.removeById(),
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
