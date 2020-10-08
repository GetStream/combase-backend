import mongoose from "mongoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { schemaComposer } from "graphql-compose";

import ChatSchema from "./model";

const Model = mongoose.model("Chat", ChatSchema);

const customizationOptions = {};
const ChatTC = composeMongoose(Model, customizationOptions);

schemaComposer.Query.addFields({
  chatById: ChatTC.mongooseResolvers.findById,
  chatByIds: ChatTC.mongooseResolvers.findByIds,
  chatOne: ChatTC.mongooseResolvers.findOne,
  chatMany: ChatTC.mongooseResolvers.findMany,
  chatCount: ChatTC.mongooseResolvers.count,
});

schemaComposer.Mutation.addFields({
  chatCreateOne: ChatTC.mongooseResolvers.createOne,
  chatCreateMany: ChatTC.mongooseResolvers.createMany,
  chatUpdateById: ChatTC.mongooseResolvers.updateById,
  chatUpdateOne: ChatTC.mongooseResolvers.updateOne,
  chatUpdateMany: ChatTC.mongooseResolvers.updateMany,
  chatRemoveById: ChatTC.mongooseResolvers.removeById,
  chatRemoveOne: ChatTC.mongooseResolvers.removeOne,
  chatRemoveMany: ChatTC.mongooseResolvers.removeMany,
});

export default schemaComposer.buildSchema();
