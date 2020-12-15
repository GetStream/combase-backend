import { delegateToSchema } from 'apollo-server-express';
import { schema as streamFeeds } from '@stream-io/graphql-feeds';
import { UserTC } from 'api/schema/user/model';

import { TicketTC } from './model';

TicketTC.addFields({
	activity: {
		type: 'StreamFlatFeed',
		args: {},
		resolve: (source, args, context, info) =>
			delegateToSchema({
				args: { id: `ticket:${source._id}` },
				context,
				fieldName: 'flatFeed',
				info,
				operation: 'query',
				schema: streamFeeds,
			}),
	},
	/*
	 * IDEA/TODO - For @graphql-stream/chat, we can add a realtion field to the ticket
	 * for a channel and have everything come from one query...
	 */
});

TicketTC.addRelation('user', {
	prepareArgs: {
		_id: source => source.user,
	},
	resolver: UserTC.mongooseResolvers.findById,
});
