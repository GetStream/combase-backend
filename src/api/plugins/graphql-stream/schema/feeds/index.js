/* eslint-disable import/exports-last */
import { SchemaComposer } from 'graphql-compose';

const feedsSchema = new SchemaComposer();

export const FeedTC = feedsSchema.createObjectTC(`
	type Feed {
		results: [Activity]
	}
`);

export const RealtimeFeedTC = feedsSchema.createObjectTC(`
	type RealtimeFeed {
		deleted: [Activity]
		deleted_foreign_ids: [String]
		feed: String!
		new: [Activity]
	}
`);

export const ActivityTC = feedsSchema.createObjectTC(`
	type Activity {
		actor: String!
		verb: String!
		object: String!
		time: String
		to: [String!] 
		foreign_id: String
	}
`);

FeedTC.addResolver({
	name: 'streamFeed',
	args: {
		id: 'String',
		slug: 'String!',
	},
	kind: 'query',
	type: FeedTC,
	resolver: (_, { id, slug }, { context: { stream } }) => stream.feeds.feed(slug, id).get(),
});

feedsSchema.Query.addFields({
	streamFeed: FeedTC.getResolver('streamFeed'),
});

feedsSchema.Subscription.addFields({
	subscribeStreamFeed: {
		args: {
			id: 'String',
			slug: 'String!',
		},
		king: 'subscription',
		type: RealtimeFeedTC,
		resolve: payload => payload,
		subscribe: (_, { id, slug }, { context: { stream } }) => new stream.FeedsSubscription(stream.feeds).asyncIterator(`${slug}:${id}`),
	},
});

export default feedsSchema.buildSchema();
/* eslint-enable import/exports-last */
