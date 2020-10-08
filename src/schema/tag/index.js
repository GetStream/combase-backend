import mongoose from "mongoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { schemaComposer } from "graphql-compose";

import TagSchema from "./model";

const Model = mongoose.model("Tag", TagSchema);

const customizationOptions = {};
const TagTC = composeMongoose(Model, customizationOptions);

schemaComposer.Query.addFields({
  tagById: TagTC.mongooseResolvers.findById,
  tagByIds: TagTC.mongooseResolvers.findByIds,
  tagOne: TagTC.mongooseResolvers.findOne,
  tagMany: TagTC.mongooseResolvers.findMany,
  tagCount: TagTC.mongooseResolvers.count,
});

schemaComposer.Mutation.addFields({
  tagCreateOne: TagTC.mongooseResolvers.createOne,
  tagCreateMany: TagTC.mongooseResolvers.createMany,
  tagUpdateById: TagTC.mongooseResolvers.updateById,
  tagUpdateOne: TagTC.mongooseResolvers.updateOne,
  tagUpdateMany: TagTC.mongooseResolvers.updateMany,
  tagRemoveById: TagTC.mongooseResolvers.removeById,
  tagRemoveOne: TagTC.mongooseResolvers.removeOne,
  tagRemoveMany: TagTC.mongooseResolvers.removeMany,
});

export default schemaComposer.buildSchema();
