import resolvers from './resolvers';
import { FaqTC } from './model';

const Query = {
	faqById: FaqTC.mongooseResolvers.findById,
	faqByIds: FaqTC.mongooseResolvers.findByIds,
	faqOne: FaqTC.mongooseResolvers.findOne,
	faqMany: FaqTC.mongooseResolvers.findMany,
	faqCount: FaqTC.mongooseResolvers.count,
	...resolvers.Query,
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
	...resolvers.Mutation,
};

// eslint-disable-next-line no-duplicate-imports
export * from './model';

export default {
	Query,
	Mutation,
};
