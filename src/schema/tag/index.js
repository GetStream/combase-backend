import mongoose from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';

import Schema from './model';

const Model = mongoose.model('Tag', Schema);

const customizationOptions = {};
const TagTC = composeMongoose(Model, customizationOptions);

const Query = {
	tagById: TagTC.mongooseResolvers.findById,
	tagByIds: TagTC.mongooseResolvers.findByIds,
	tagOne: TagTC.mongooseResolvers.findOne,
	tagMany: TagTC.mongooseResolvers.findMany,
	tagCount: TagTC.mongooseResolvers.count,
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
};

export const TagModel = Model;

export default {
	Query,
	Mutation,
};
