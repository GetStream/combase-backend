import mongoose, { Schema } from "mongoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { schemaComposer } from "graphql-compose";
import timestamps from "mongoose-timestamp";

const UserSchema = new Schema(
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
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
    },
  },
  { collection: "users" }
);

UserSchema.plugin(timestamps);

UserSchema.index({
  createdAt: 1,
  updatedAt: 1,
});

const User = mongoose.model("User", UserSchema);

const customizationOptions = {};
const UserTC = composeMongoose(User, customizationOptions);

/*
 * schemaComposer.addTypeDefs();
 * schemaComposer.addResolveMethods();
 */

schemaComposer.Query.addFields({
  userById: UserTC.mongooseResolvers.findById,
  userByIds: UserTC.mongooseResolvers.findByIds,
  userOne: UserTC.mongooseResolvers.findOne,
  userMany: UserTC.mongooseResolvers.findMany,
  userCount: UserTC.mongooseResolvers.count,
});

schemaComposer.Mutation.addFields({
  userCreateOne: UserTC.mongooseResolvers.createOne,
  userCreateMany: UserTC.mongooseResolvers.createMany,
  userUpdateById: UserTC.mongooseResolvers.updateById,
  userUpdateOne: UserTC.mongooseResolvers.updateOne,
  userUpdateMany: UserTC.mongooseResolvers.updateMany,
  userRemoveById: UserTC.mongooseResolvers.removeById,
  userRemoveOne: UserTC.mongooseResolvers.removeOne,
  userRemoveMany: UserTC.mongooseResolvers.removeMany,
});

const schema = schemaComposer.buildSchema();

export default { schema };
