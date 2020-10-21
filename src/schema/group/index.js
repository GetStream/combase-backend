import mongoose from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';

import Schema from './model';

const Model = mongoose.model('Group', Schema);

const customizationOptions = {};
const GroupTC = composeMongoose(Model, customizationOptions);

const Query = {
	groupById: GroupTC.mongooseResolvers.findById,
	groupByIds: GroupTC.mongooseResolvers.findByIds,
	groupOne: GroupTC.mongooseResolvers.findOne,
	groupMany: GroupTC.mongooseResolvers.findMany,
	groupCount: GroupTC.mongooseResolvers.count,
};

const Mutation = {
	groupCreateOne: GroupTC.mongooseResolvers.createOne,
	groupCreateMany: GroupTC.mongooseResolvers.createMany,
	groupUpdateById: GroupTC.mongooseResolvers.updateById,
	groupUpdateOne: GroupTC.mongooseResolvers.updateOne,
	groupUpdateMany: GroupTC.mongooseResolvers.updateMany,
	groupRemoveById: GroupTC.mongooseResolvers.removeById,
	groupRemoveOne: GroupTC.mongooseResolvers.removeOne,
	groupRemoveMany: GroupTC.mongooseResolvers.removeMany,
};

export const GroupModel = Model;

export default {
	Query,
	Mutation,
};
