import mongoose from "mongoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { schemaComposer } from "graphql-compose";

import GroupSchema from "./model";

const Model = mongoose.model("Group", GroupSchema);

const customizationOptions = {};
const GroupTC = composeMongoose(Model, customizationOptions);

schemaComposer.Query.addFields({
  groupById: GroupTC.mongooseResolvers.findById,
  groupByIds: GroupTC.mongooseResolvers.findByIds,
  groupOne: GroupTC.mongooseResolvers.findOne,
  groupMany: GroupTC.mongooseResolvers.findMany,
  groupCount: GroupTC.mongooseResolvers.count,
});

schemaComposer.Mutation.addFields({
  groupCreateOne: GroupTC.mongooseResolvers.createOne,
  groupCreateMany: GroupTC.mongooseResolvers.createMany,
  groupUpdateById: GroupTC.mongooseResolvers.updateById,
  groupUpdateOne: GroupTC.mongooseResolvers.updateOne,
  groupUpdateMany: GroupTC.mongooseResolvers.updateMany,
  groupRemoveById: GroupTC.mongooseResolvers.removeById,
  groupRemoveOne: GroupTC.mongooseResolvers.removeOne,
  groupRemoveMany: GroupTC.mongooseResolvers.removeMany,
});

export default schemaComposer.buildSchema();
