import mongoose from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';

import Schema from './model';

const Model = mongoose.model('Asset', Schema);

const customizationOptions = {};
const AssetTC = composeMongoose(Model, customizationOptions);

const Query = {
	assetById: AssetTC.mongooseResolvers.findById,
	assetByIds: AssetTC.mongooseResolvers.findByIds,
	assetOne: AssetTC.mongooseResolvers.findOne,
	assetMany: AssetTC.mongooseResolvers.findMany,
	assetCount: AssetTC.mongooseResolvers.count,
};

const Mutation = {
	assetCreateOne: AssetTC.mongooseResolvers.createOne,
	assetCreateMany: AssetTC.mongooseResolvers.createMany,
	assetUpdateById: AssetTC.mongooseResolvers.updateById,
	assetUpdateOne: AssetTC.mongooseResolvers.updateOne,
	assetUpdateMany: AssetTC.mongooseResolvers.updateMany,
	assetRemoveById: AssetTC.mongooseResolvers.removeById,
	assetRemoveOne: AssetTC.mongooseResolvers.removeOne,
	assetRemoveMany: AssetTC.mongooseResolvers.removeMany,
};

export const AssetModel = Model;
export default {
	Query,
	Mutation,
};
