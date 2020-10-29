import './relations';
import resolvers from './resolvers';
import { OrganizationTC } from './model';
import { delegateToSchema } from '@graphql-tools/delegate';

import { schema as streamSchema } from 'api/plugins/graphql-stream';

/**
 * Extend Organization Type
 */
OrganizationTC.removeField('stream.secret');

OrganizationTC.addFields({
	// TODO: Maybe move this somewhere better.
	timeline: {
		type: 'JSON',
		resolve: (source, _, context, info) =>
			delegateToSchema({
				schema: streamSchema,
				operation: 'query',
				fieldName: 'flatFeed',
				args: {
					slug: 'organization',
					id: source._id,
				},
				context,
				info,
			}),
	},
});

/**
 * Resolvers
 */

const Query = {
	organizationById: OrganizationTC.mongooseResolvers.findById,
	organizationByIds: OrganizationTC.mongooseResolvers.findByIds,
	organizationOne: OrganizationTC.mongooseResolvers.findOne,
	organizationMany: OrganizationTC.mongooseResolvers.findMany,
	organizationCount: OrganizationTC.mongooseResolvers.count,
	...resolvers.Query,
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
