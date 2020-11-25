import { isAgentAvailableIntl } from 'utils/isAgentAvailableIntl';

import { AgentTC } from './model';

AgentTC.addFields({
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
	openTicketCount: {
		type: 'Int!',
		resolve: ({ _id, organization }, _, { models: { Ticket } }) =>
			Ticket.countDocuments({
				agent: { $in: [_id] },
				organization,
				status: 'open',
			}),
	},
	closedTicketCount: {
		type: 'Int!',
		resolve: ({ _id, organization }, _, { models: { Ticket } }) =>
			Ticket.countDocuments({
				agent: { $in: [_id] },
				organization,
				status: 'closed',
			}),
	},
	totalTicketCount: {
		type: 'Int!',
		resolve: ({ _id, organization }, _, { models: { Ticket } }) =>
			Ticket.countDocuments({
				agent: { $in: [_id] },
				organization,
			}),
	},
	timeline: {
		type: 'StreamFeed',
		args: {},
		resolve: ({ _id }, _, { stream }) => stream.feeds.feed('agent', _id).get(),
	},
	streamToken: {
		type: 'String',
		resolve: ({ _id }, _, { agent, stream: { chat } }) => (agent.toString() === _id.toString() ? chat?.createToken(_id.toString()) : null),
	},
	token: 'String' /** Never stored in mongo & is nullable, only ever returned by the loginAgent resolver. */,
});

AgentTC.removeField('password');
