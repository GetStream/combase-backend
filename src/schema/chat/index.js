import mongoose from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';

import Schema from './model';

const Model = mongoose.model('Chat', Schema);

const customizationOptions = {};
const ChatTC = composeMongoose(Model, customizationOptions);

const Query = {
	chatById: ChatTC.mongooseResolvers.findById,
	chatByIds: ChatTC.mongooseResolvers.findByIds,
	chatOne: ChatTC.mongooseResolvers.findOne,
	chatMany: ChatTC.mongooseResolvers.findMany,
	chatCount: ChatTC.mongooseResolvers.count,
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
};

export const ChatModel = Model;

export default {
	Query,
	Mutation,
};
