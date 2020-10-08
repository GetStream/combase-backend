import mongoose, { Schema } from "mongoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { schemaComposer } from "graphql-compose";
import timestamps from "mongoose-timestamp";

const TeamSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    name: {
      required: true,
      trim: true,
      type: String,
    },
    logo: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { collection: "teams" }
);

TeamSchema.plugin(timestamps);

TeamSchema.index({
  createdAt: 1,
  updatedAt: 1,
});

const Team = mongoose.model("Team", TeamSchema);

const customizationOptions = {};
const TeamTC = composeMongoose(Team, customizationOptions);

/*
 * schemaComposer.addTypeDefs();
 * schemaComposer.addResolveMethods();
 */

schemaComposer.Query.addFields({
  teamById: TeamTC.mongooseResolvers.findById,
  teamByIds: TeamTC.mongooseResolvers.findByIds,
  teamOne: TeamTC.mongooseResolvers.findOne,
  teamMany: TeamTC.mongooseResolvers.findMany,
  teamCount: TeamTC.mongooseResolvers.count,
});

schemaComposer.Mutation.addFields({
  teamCreateOne: TeamTC.mongooseResolvers.createOne,
  teamCreateMany: TeamTC.mongooseResolvers.createMany,
  teamUpdateById: TeamTC.mongooseResolvers.updateById,
  teamUpdateOne: TeamTC.mongooseResolvers.updateOne,
  teamUpdateMany: TeamTC.mongooseResolvers.updateMany,
  teamRemoveById: TeamTC.mongooseResolvers.removeById,
  teamRemoveOne: TeamTC.mongooseResolvers.removeOne,
  teamRemoveMany: TeamTC.mongooseResolvers.removeMany,
});

const schema = schemaComposer.buildSchema();

export default { schema };
