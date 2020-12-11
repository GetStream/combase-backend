import { delegateToSchema } from 'apollo-server-express';
import { schema as streamFeeds } from '@stream-io/graphql-feeds';

import { UserTC } from './model';

UserTC.addFields({
	activity: {
		type: 'StreamFlatFeed',
		args: {},
		resolve: (source, args, context, info) =>
			delegateToSchema({
				args: { id: `user:${source._id}` },
				context,
				fieldName: 'flatFeed',
				info,
				operation: 'query',
				schema: streamFeeds,
			}),
	},
	streamToken: {
		type: 'String',
		resolve: ({ _id }, _, { stream: { chat } }) => chat?.createToken(_id.toString()),
	},
});
