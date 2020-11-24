import './relations';
import './extend';
import resolvers from './resolvers';
import { OrganizationTC } from './model';

const Query = {
	organizationById: OrganizationTC.mongooseResolvers.findById(),
	organizationByIds: OrganizationTC.mongooseResolvers.findByIds(),
	organizationOne: OrganizationTC.mongooseResolvers.findOne(),
	organizationMany: OrganizationTC.mongooseResolvers.findMany(),
	organizationCount: OrganizationTC.mongooseResolvers.count(),
	...resolvers.Query,
};

const Mutation = {
	organizationCreateOne: OrganizationTC.mongooseResolvers.createOne(),
	organizationCreateMany: OrganizationTC.mongooseResolvers.createMany(),
	organizationUpdateById: OrganizationTC.mongooseResolvers.updateById(),
	organizationUpdateOne: OrganizationTC.mongooseResolvers.updateOne(),
	organizationUpdateMany: OrganizationTC.mongooseResolvers.updateMany(),
	organizationRemoveById: OrganizationTC.mongooseResolvers.removeById(),
	organizationRemoveOne: OrganizationTC.mongooseResolvers.removeOne(),
	organizationRemoveMany: OrganizationTC.mongooseResolvers.removeMany(),
	...resolvers.Mutation,
};

const Subscription = {
	...resolvers.Subscription,
};

export default {
	Query,
	Mutation,
	Subscription,
};
