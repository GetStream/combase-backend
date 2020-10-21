import mongoose from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';

import Schema from './model';

const Model = mongoose.model('Faq', Schema);

const customizationOptions = {};
const FaqTC = composeMongoose(Model, customizationOptions);

const Query = {
	faqById: FaqTC.mongooseResolvers.findById,
	faqByIds: FaqTC.mongooseResolvers.findByIds,
	faqOne: FaqTC.mongooseResolvers.findOne,
	faqMany: FaqTC.mongooseResolvers.findMany,
	faqCount: FaqTC.mongooseResolvers.count,
};

const Mutation = {
	faqCreateOne: FaqTC.mongooseResolvers.createOne,
	faqCreateMany: FaqTC.mongooseResolvers.createMany,
	faqUpdateById: FaqTC.mongooseResolvers.updateById,
	faqUpdateOne: FaqTC.mongooseResolvers.updateOne,
	faqUpdateMany: FaqTC.mongooseResolvers.updateMany,
	faqRemoveById: FaqTC.mongooseResolvers.removeById,
	faqRemoveOne: FaqTC.mongooseResolvers.removeOne,
	faqRemoveMany: FaqTC.mongooseResolvers.removeMany,
};

export const FaqModel = Model;

export default {
	Query,
	Mutation,
};
