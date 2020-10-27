import resolvers from './resolvers';
import { UserTC } from './model';

/**
 * Extend Agent Type
 */
UserTC.addFields({
	streamToken: {
		type: 'String',
		resolve: ({ _id }, _, { stream: { chat } }) => chat?.createToken(_id.toString()),
	},
});

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

export default {
	Query,
	Mutation,
};