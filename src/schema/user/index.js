import mongoose from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';

import Schema from './model';

const Model = mongoose.model('User', Schema);

const customizationOptions = {};
const UserTC = composeMongoose(Model, customizationOptions);

const Query = {
	userById: UserTC.mongooseResolvers.findById,
	userByIds: UserTC.mongooseResolvers.findByIds,
	userOne: UserTC.mongooseResolvers.findOne,
	userMany: UserTC.mongooseResolvers.findMany,
	userCount: UserTC.mongooseResolvers.count,
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
};

export const UserModel = Model;

export default {
	Query,
	Mutation,
};
