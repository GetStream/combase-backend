import resolvers from './resolvers';
import { FaqTC } from './model';

const Query = {
	faq: FaqTC.mongooseResolvers.findById(),
	faqs: FaqTC.mongooseResolvers.connection(),
	...resolvers.Query,
};

const Mutation = {
	faqCreate: FaqTC.mongooseResolvers.createOne(),
	faqUpdate: FaqTC.mongooseResolvers.updateById(),
	faqRemove: FaqTC.mongooseResolvers.removeById(),
	faqRemoveMany: FaqTC.mongooseResolvers.removeMany(),
	...resolvers.Mutation,
};

export default {
	Query,
	Mutation,
};
