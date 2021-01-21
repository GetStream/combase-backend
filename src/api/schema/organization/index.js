import './relations';
import './extend';
import resolvers from './resolvers';
import { OrganizationTC } from './model';

import { createOrgChatCustomizations, syncOrganizationProfile } from 'utils/resolverMiddlewares/streamChat';

const Query = {
	organizationById: OrganizationTC.mongooseResolvers.findById(),
	organizationCount: OrganizationTC.mongooseResolvers.count(),
	...resolvers.Query,
};

const Mutation = {
	organizationCreate: OrganizationTC.mongooseResolvers.createOne().withMiddlewares([syncOrganizationProfile, createOrgChatCustomizations]),
	organizationUpdate: OrganizationTC.mongooseResolvers.updateById().withMiddlewares([syncOrganizationProfile]),
	organizationRemove: OrganizationTC.mongooseResolvers.removeById(),
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
