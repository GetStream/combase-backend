import mongoose, { Schema } from "mongoose";
import { composeMongoose } from "graphql-compose-mongoose";
import { schemaComposer } from "graphql-compose";
import timestamps from "mongoose-timestamp";

const OrganizationSchema = new Schema(
  {
    name: {
      required: true,
      type: String,
    },
    contact: {
      email: {
        type: String,
        trim: true,
        default: "",
      },
      phone: {
        type: String,
        trim: true,
        default: "",
      },
    },
    branding: {
      logo: {
        type: String,
        trim: true,
      },
      colors: {
        primary: {
          type: String,
          trim: true,
        },
        secondary: {
          type: String,
          trim: true,
        },
      },
    },
  },
  { collection: "organizations" }
);

OrganizationSchema.plugin(timestamps);

OrganizationSchema.index({
  createdAt: 1,
  updatedAt: 1,
});

const Organization = mongoose.model("Organization", OrganizationSchema);

const customizationOptions = {};
const OrganizationTC = composeMongoose(Organization, customizationOptions);

/*
 * schemaComposer.addTypeDefs();
 * schemaComposer.addResolveMethods();
 */

schemaComposer.Query.addFields({
  organizationById: OrganizationTC.mongooseResolvers.findById,
  organizationByIds: OrganizationTC.mongooseResolvers.findByIds,
  organizationOne: OrganizationTC.mongooseResolvers.findOne,
  organizationMany: OrganizationTC.mongooseResolvers.findMany,
  organizationCount: OrganizationTC.mongooseResolvers.count,
});

schemaComposer.Mutation.addFields({
  organizationCreateOne: OrganizationTC.mongooseResolvers.createOne,
  organizationCreateMany: OrganizationTC.mongooseResolvers.createMany,
  organizationUpdateById: OrganizationTC.mongooseResolvers.updateById,
  organizationUpdateOne: OrganizationTC.mongooseResolvers.updateOne,
  organizationUpdateMany: OrganizationTC.mongooseResolvers.updateMany,
  organizationRemoveById: OrganizationTC.mongooseResolvers.removeById,
  organizationRemoveOne: OrganizationTC.mongooseResolvers.removeOne,
  organizationRemoveMany: OrganizationTC.mongooseResolvers.removeMany,
});

const schema = schemaComposer.buildSchema();

export default { schema };
