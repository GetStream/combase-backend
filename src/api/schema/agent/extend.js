import { delegateToSchema } from 'apollo-server-express';
import { schema as streamFeeds } from '@stream-io/graphql-feeds';

import { AgentTC } from './model';
import { TicketTC } from '../ticket/model';

AgentTC.addFields({
	activity: {
		type: 'StreamFlatFeed',
		args: {},
		resolve: (source, args, context, info) =>
			delegateToSchema({
				args: { id: `agent:${source._id}` },
				context,
				fieldName: 'flatFeed',
				info,
				operation: 'query',
				schema: streamFeeds,
			}),
	},
	available: 'Boolean',
	streamToken: {
		type: 'String',
		resolve: ({ _id }, _, { agent, stream: { chat } }) => (agent.toString() === _id.toString() ? chat?.createToken(_id.toString()) : null),
	},
	token: 'String' /** Never stored in mongo & is nullable, only ever returned by the loginAgent resolver. */,
});

AgentTC.removeField('password');

AgentTC.addRelation('tickets', {
	prepareArgs: {
		filter: source => ({
			agents: {
				$in: [source._id],
			},
		}),
	},
	projection: { _id: true },
	resolver: () => TicketTC.mongooseResolvers.connection({ name: 'AgentTickets' }),
});
