import { organizationFilter } from 'utils/resolverMiddlewares/scopes';

import './extend';
import resolvers from './resolvers';
import { UserTC } from './model';

const Query = {
	userById: UserTC.mongooseResolvers.findById().withMiddlewares([organizationFilter]),
	userByIds: UserTC.mongooseResolvers.findByIds().withMiddlewares([organizationFilter]),
	userOne: UserTC.mongooseResolvers.findOne().withMiddlewares([organizationFilter]),
	userMany: UserTC.mongooseResolvers.findMany().withMiddlewares([organizationFilter]),
	userCount: UserTC.mongooseResolvers.count().withMiddlewares([organizationFilter]),
	...resolvers.Query,
};

const Mutation = {
	userCreateOne: UserTC.mongooseResolvers.createOne(),
	userCreateMany: UserTC.mongooseResolvers.createMany(),
	userUpdateById: UserTC.mongooseResolvers.updateById(),
	userUpdateOne: UserTC.mongooseResolvers.updateOne(),
	userUpdateMany: UserTC.mongooseResolvers.updateMany(),
	userRemoveById: UserTC.mongooseResolvers.removeById(),
	userRemoveOne: UserTC.mongooseResolvers.removeOne(),
	userRemoveMany: UserTC.mongooseResolvers.removeMany().withMiddlewares([organizationFilter]),
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
