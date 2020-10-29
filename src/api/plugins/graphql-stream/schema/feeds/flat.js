import { schemaComposer } from 'graphql-compose';

const FlatFeedTC = schemaComposer.createObjectTC(`
	type FlatFeed {
		duration: String!
		next: String!
		results: [Activity]
	}
`);

const FlatFeedSubscriptionTC = schemaComposer.createObjectTC(`
	type FlatFeedSubscription {
		deleted: [Activity]
		deleted_foreign_ids: [String]
		feed: String!
		new: [Activity]
	}
`);

const Query = {
	feed: {
		type: FlatFeedTC.getType(),
		kind: 'query',
		args: {
			slug: 'String!',
			id: 'String!',
		},
		resolve: (_, { slug, id }, { stream: { feeds } }) => feeds.feed(slug, id).get(),
	},
};

const Subscription = {
	feedSubscription: {
		type: FlatFeedSubscriptionTC.getType(),
		kind: 'subscription',
		args: {
			slug: 'String!',
			id: 'String!',
		},
		subscribe: (
			_,
			{ slug, id },
			{
				stream: {
					subscriptions: { feeds },
				},
			}
		) => feeds.asyncIterator(`${slug}:${id}`),
	},
};

export default {
	Query,
	Subscription,
};
