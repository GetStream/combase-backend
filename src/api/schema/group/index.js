import './extend';
import resolvers from './resolvers';
import { GroupTC } from './model';

const Query = {
	groupById: GroupTC.mongooseResolvers.findById(),
	groupByIds: GroupTC.mongooseResolvers.findByIds(),
	groupOne: GroupTC.mongooseResolvers.findOne(),
	groupMany: GroupTC.mongooseResolvers.findMany(),
	groupCount: GroupTC.mongooseResolvers.count(),
	...resolvers.Query,
};

const Mutation = {
	groupCreateOne: GroupTC.mongooseResolvers.createOne(),
	groupCreateMany: GroupTC.mongooseResolvers.createMany(),
	groupUpdateById: GroupTC.mongooseResolvers.updateById(),
	groupUpdateOne: GroupTC.mongooseResolvers.updateOne(),
	groupUpdateMany: GroupTC.mongooseResolvers.updateMany(),
	groupRemoveById: GroupTC.mongooseResolvers.removeById(),
	groupRemoveOne: GroupTC.mongooseResolvers.removeOne(),
	groupRemoveMany: GroupTC.mongooseResolvers.removeMany(),
	...resolvers.Mutation,
};

export default {
	Query,
	Mutation,
};
