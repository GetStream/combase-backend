import mongoose, { Schema } from "mongoose";
import bcrypt from "mongoose-bcrypt";
import { composeMongoose } from "graphql-compose-mongoose";
import { schemaComposer } from "graphql-compose";
import timestamps from "mongoose-timestamp";

const AgentSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    name: {
      first: {
        required: true,
        trim: true,
        type: String,
      },
      last: {
        required: true,
        trim: true,
        type: String,
      },
    },
    avatar: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      bcrypt: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { collection: "agents" }
);

AgentSchema.plugin(bcrypt);
AgentSchema.plugin(timestamps);

AgentSchema.index({
  createdAt: 1,
  updatedAt: 1,
});

const Agent = mongoose.model("Agent", AgentSchema);

const customizationOptions = {};
const AgentTC = composeMongoose(Agent, customizationOptions);

/*
 * const typeDefs = ``;
 * const resolvers = {};
 */

/*
 * schemaComposer.addTypeDefs(typeDefs);
 * schemaComposer.addResolveMethods(resolvers);
 */

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

const schema = schemaComposer.buildSchema();

export default { schema };
