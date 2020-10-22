import resolvers from './resolvers';
import { TagTC } from './model';

const Query = {
	tagById: TagTC.mongooseResolvers.findById,
	tagByIds: TagTC.mongooseResolvers.findByIds,
	tagOne: TagTC.mongooseResolvers.findOne,
	tagMany: TagTC.mongooseResolvers.findMany,
	tagCount: TagTC.mongooseResolvers.count,
	...resolvers.Query,
};

const Mutation = {
	tagCreateOne: TagTC.mongooseResolvers.createOne,
	tagCreateMany: TagTC.mongooseResolvers.createMany,
	tagUpdateById: TagTC.mongooseResolvers.updateById,
	tagUpdateOne: TagTC.mongooseResolvers.updateOne,
	tagUpdateMany: TagTC.mongooseResolvers.updateMany,
	tagRemoveById: TagTC.mongooseResolvers.removeById,
	tagRemoveOne: TagTC.mongooseResolvers.removeOne,
	tagRemoveMany: TagTC.mongooseResolvers.removeMany,
	...resolvers.Mutation,
};

export default {
	Query,
	Mutation,
};
