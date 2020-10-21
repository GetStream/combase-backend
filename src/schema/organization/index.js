import mongoose from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { schemaComposer } from 'graphql-compose';

import resolvers from './resolvers';
import { typeDefs } from './typeDefs';
import Schema from './model';

const Model = mongoose.model('Organization', Schema);

const customizationOptions = {};
const OrganizationTC = composeMongoose(Model, customizationOptions);

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

if (typeDefs) schemaComposer.addTypeDefs(typeDefs);

schemaComposer.addResolveMethods(resolvers);

export const OrganizationModel = Model;
export const OrganizationSchema = schemaComposer.buildSchema();
