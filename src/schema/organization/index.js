import mongoose from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';

import Schema from './model';

const Model = mongoose.model('Organization', Schema);

const customizationOptions = {};
const OrganizationTC = composeMongoose(Model, customizationOptions);

const Query = {
	organizationById: OrganizationTC.mongooseResolvers.findById,
	organizationByIds: OrganizationTC.mongooseResolvers.findByIds,
	organizationOne: OrganizationTC.mongooseResolvers.findOne,
	organizationMany: OrganizationTC.mongooseResolvers.findMany,
	organizationCount: OrganizationTC.mongooseResolvers.count,
};

const Mutation = {
	organizationCreateOne: OrganizationTC.mongooseResolvers.createOne,
	organizationCreateMany: OrganizationTC.mongooseResolvers.createMany,
	organizationUpdateById: OrganizationTC.mongooseResolvers.updateById,
	organizationUpdateOne: OrganizationTC.mongooseResolvers.updateOne,
	organizationUpdateMany: OrganizationTC.mongooseResolvers.updateMany,
	organizationRemoveById: OrganizationTC.mongooseResolvers.removeById,
	organizationRemoveOne: OrganizationTC.mongooseResolvers.removeOne,
	organizationRemoveMany: OrganizationTC.mongooseResolvers.removeMany,
};

export const OrganizationModel = Model;

export default {
	Query,
	Mutation,
};
