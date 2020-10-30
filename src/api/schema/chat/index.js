import resolvers from './resolvers';
import { ChatTC } from './model';

const Query = {
	chatById: ChatTC.mongooseResolvers.findById,
	chatByIds: ChatTC.mongooseResolvers.findByIds,
	chatOne: ChatTC.mongooseResolvers.findOne,
	chatMany: ChatTC.mongooseResolvers.findMany,
	chatCount: ChatTC.mongooseResolvers.count,
	...resolvers.Query,
};

const Mutation = {
	chatCreateOne: ChatTC.mongooseResolvers.createOne,
	chatCreateMany: ChatTC.mongooseResolvers.createMany,
	chatUpdateById: ChatTC.mongooseResolvers.updateById,
	chatUpdateOne: ChatTC.mongooseResolvers.updateOne,
	chatUpdateMany: ChatTC.mongooseResolvers.updateMany,
	chatRemoveById: ChatTC.mongooseResolvers.removeById,
	chatRemoveOne: ChatTC.mongooseResolvers.removeOne,
	chatRemoveMany: ChatTC.mongooseResolvers.removeMany,
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
