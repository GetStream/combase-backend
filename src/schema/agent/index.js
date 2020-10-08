import mongoose from "mongoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { schemaComposer } from "graphql-compose";

//import resolvers from "./resolvers";
import AgentSchema from "./model";

const Model = mongoose.model("Agent", AgentSchema);

const customizationOptions = {};
const AgentTC = composeMongoose(Model, customizationOptions);

schemaComposer.Query.addFields({
  agentById: AgentTC.mongooseResolvers.findById,
  agentByIds: AgentTC.mongooseResolvers.findByIds,
  agentOne: AgentTC.mongooseResolvers.findOne,
  agentMany: AgentTC.mongooseResolvers.findMany,
  agentCount: AgentTC.mongooseResolvers.count,
});

schemaComposer.Mutation.addFields({
  agentCreateOne: AgentTC.mongooseResolvers.createOne,
  agentCreateMany: AgentTC.mongooseResolvers.createMany,
  agentUpdateById: AgentTC.mongooseResolvers.updateById,
  agentUpdateOne: AgentTC.mongooseResolvers.updateOne,
  agentUpdateMany: AgentTC.mongooseResolvers.updateMany,
  agentRemoveById: AgentTC.mongooseResolvers.removeById,
  agentRemoveOne: AgentTC.mongooseResolvers.removeOne,
  agentRemoveMany: AgentTC.mongooseResolvers.removeMany,
});

//schemaComposer.addResolveMethods(resolvers);

export default schemaComposer.buildSchema();
