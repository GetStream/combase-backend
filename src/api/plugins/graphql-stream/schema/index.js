import { makeExecutableSchema } from 'graphql-tools';
import { FeedsSubscriber } from '../subscriptions';

const typeDefs = `
	# Feeds
	type FlatFeedPayload {
		duration: String!
		next: String!
		results: [ActivityItem]
	}

	type FeedSubscriptionPayload {
		deleted: [ActivityItem]
		deleted_foreign_ids: [String]
		feed: String!
		new: [ActivityItem]
	}

	# Activities
	type ActivityItem {
		actor: String!
		verb: String!
		object: String!
		time: String
		to: [String!] 
		foreign_id: String
	}

	type Query {
		flatFeed(slug: String!, id: String!): FlatFeedPayload!
	}

	type Subscription {
		subscribeToFeed(slug: String!, id: String!): FeedSubscriptionPayload!
	}
`;

const resolvers = {
	Query: {
		flatFeed: (_, { slug, id }, { stream: { feeds } }) => feeds.feed(slug, id).get(),
	},
	Subscription: {
		subscribeToFeed: {
			resolve: payload => payload,
			subscribe: (_, { slug, id }, { stream: { feeds } }) => new FeedsSubscriber(feeds).asyncIterator(`${slug}:${id}`),
		},
	},
};

export const schema = makeExecutableSchema({
	typeDefs,
	resolvers,
});
