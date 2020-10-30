import './extend';
import resolvers from './resolvers';
import { UserTC } from './model';

const Query = {
	userById: UserTC.mongooseResolvers.findById,
	userByIds: UserTC.mongooseResolvers.findByIds,
	userOne: UserTC.mongooseResolvers.findOne,
	userMany: UserTC.mongooseResolvers.findMany,
	userCount: UserTC.mongooseResolvers.count,
	...resolvers.Query,
};

const Mutation = {
	userCreateOne: UserTC.mongooseResolvers.createOne,
	userCreateMany: UserTC.mongooseResolvers.createMany,
	userUpdateById: UserTC.mongooseResolvers.updateById,
	userUpdateOne: UserTC.mongooseResolvers.updateOne,
	userUpdateMany: UserTC.mongooseResolvers.updateMany,
	userRemoveById: UserTC.mongooseResolvers.removeById,
	userRemoveOne: UserTC.mongooseResolvers.removeOne,
	userRemoveMany: UserTC.mongooseResolvers.removeMany,
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
