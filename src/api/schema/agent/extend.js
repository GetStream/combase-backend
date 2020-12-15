import { delegateToSchema } from 'apollo-server-express';
import { schema as streamFeeds } from '@stream-io/graphql-feeds';
import { isAgentAvailableIntl } from 'utils/isAgentAvailableIntl';

import { AgentTC } from './model';

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
	available: {
		type: 'Boolean',
		args: {},
		resolve: async ({ _id }, _, { models: { Agent } }) => {
			const agent = await Agent.findById(_id, {
				hours: 1,
				timezone: 1,
			});

			return isAgentAvailableIntl(agent);
		},
	},
	streamToken: {
		type: 'String',
		resolve: ({ _id }, _, { agent, stream: { chat } }) => (agent.toString() === _id.toString() ? chat?.createToken(_id.toString()) : null),
	},
	token: 'String' /** Never stored in mongo & is nullable, only ever returned by the loginAgent resolver. */,
});

AgentTC.removeField('password');
