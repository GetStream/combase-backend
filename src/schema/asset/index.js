import mongoose from "mongoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { schemaComposer } from "graphql-compose";

import AssetSchema from "./model";

const Model = mongoose.model("Asset", AssetSchema);

const customizationOptions = {};
const AssetTC = composeMongoose(Model, customizationOptions);

schemaComposer.Query.addFields({
  assetById: AssetTC.mongooseResolvers.findById,
  assetByIds: AssetTC.mongooseResolvers.findByIds,
  assetOne: AssetTC.mongooseResolvers.findOne,
  assetMany: AssetTC.mongooseResolvers.findMany,
  assetCount: AssetTC.mongooseResolvers.count,
});

schemaComposer.Muwebhooktion.addFields({
  assetCreateOne: AssetTC.mongooseResolvers.createOne,
  assetCreateMany: AssetTC.mongooseResolvers.createMany,
  assetUpdateById: AssetTC.mongooseResolvers.updateById,
  assetUpdateOne: AssetTC.mongooseResolvers.updateOne,
  assetUpdateMany: AssetTC.mongooseResolvers.updateMany,
  assetRemoveById: AssetTC.mongooseResolvers.removeById,
  assetRemoveOne: AssetTC.mongooseResolvers.removeOne,
  assetRemoveMany: AssetTC.mongooseResolvers.removeMany,
});

export default schemaComposer.buildSchema();
