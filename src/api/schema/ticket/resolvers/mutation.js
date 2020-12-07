import { TicketTC } from '../model';

/**
 * Takes the User _id (the customer using the widget) and the organization ID as
 * arguments. Then creates a channel with just the user (ready to be routed to an agent)
 * and returns the ticket object so we can connect to the channel on the client-side.
 */

export const createTicket = {
	name: 'createTicket',
	type: TicketTC,
	kind: 'mutation',
	args: {
		message: 'String',
		user: 'MongoID!',
	},
	resolve: async (_, { message, user }, { models: { Ticket }, organization, stream }) => {
		try {
			const status = 'unassigned';
			const tags = [];

			const { _doc: ticket } = await Ticket.create({
				organization,
				user,
				status,
				tags,
			});

			await stream.chat.setUser({ id: organization });

			const channel = stream.chat.channel('messaging', ticket._id.toString(), {
				created_by_id: organization, // eslint-disable-line camelcase
				members: [user],
				organization,
				status,
				tags,
			});

			await channel.create();

			if (message) {
				channel.sendMessage({
					text: message,
					user_id: user, // eslint-disable-line camelcase
				});
			}

			return ticket;
		} catch (error) {
			throw new Error(`Ticket creation failed: ${error.message}`);
		}
	},
};

export const addToTicket = {
	name: 'addToTicket',
	type: TicketTC,
	kind: 'Mutation',
	args: {
		agent: 'MongoID!',
		ticket: 'MongoID!',
		status: 'EnumTicketStatus',
	},
	// TODO Show status has a default of open
	resolve: async (_, { ticket, agent, status = 'open' }, { models: { Ticket }, stream }) => {
		try {
			const channel = stream.chat.channel('messaging', ticket.toString());

			await channel.watch({ state: true });

			if (channel.state.members[agent.toString()]) {
				throw new Error('That agent is already a member of this channel.');
			}

			const addMember = channel.addModerators([agent.toString()]);

			/*
			 * TODO: We should create more 'sub-types' of system messages with a custom field so we can render them differently, would be cool to show the agent avatar when they get added etc.
			 * const updateChannel = channel.update(
			 * 	{
			 * 		...channel.data,
			 * 		status,
			 * 	},
			 * 	{
			 * 		subtype: 'agent_added',
			 * 		text: `An agent joined the chat.`,
			 * 		user_id: agent.toString(), // eslint-disable-line camelcase
			 * 	}
			 * );
			 */

			await Promise.all([addMember]);

			return await Ticket.findByIdAndUpdate(
				ticket,
				{
					$addToSet: {
						agents: [agent],
					},
					status,
				},
				{ new: true }
			).lean();
		} catch (error) {
			throw new Error(error.message);
		}
	},
};

export const ticketAddLabel = {
	name: 'ticketAddLabel',
	description: 'Add a label to a chat channel.',
	type: TicketTC,
	kind: 'mutation',
	args: {
		ticket: 'MongoID!',
		label: 'EnumTicketLabels!',
	},
	resolve: async (_, { ticket, label }, { models: { Ticket }, stream }) => {
		try {
			const channel = stream.chat.channel('messaging', ticket);

			await channel.watch();

			/*
			 * Ensure that labels are always unique, if the user calls ticketAddLabel
			 * again for the same toggle, it will result in no change.
			 */
			const labels = [...new Set([...(channel.data?.labels || []), label])];

			await channel.update({
				...channel.data,
				labels,
			});

			return await Ticket.findByIdAndUpdate(
				ticket,
				{
					labels,
				},
				{
					new: true,
				}
			);
		} catch (error) {
			throw new Error(error.message);
		}
	},
};

export const ticketRemoveLabel = {
	name: 'ticketRemoveLabel',
	description: 'Remove a label from a chat channel.',
	type: TicketTC,
	kind: 'mutation',
	args: {
		ticket: 'MongoID!',
		label: 'EnumTicketLabels!',
	},
	resolve: async (_, { ticket, label }, { models: { Ticket }, stream }) => {
		try {
			const channel = stream.chat.channel('messaging', ticket.toString());

			await channel.watch();

			const labels = channel.data.labels.filter(l => l !== label);

			await channel.update({
				...channel.data,
				labels,
			});

			return await Ticket.findByIdAndUpdate(
				ticket,
				{
					labels,
				},
				{
					new: true,
				}
			);
		} catch (error) {
			throw new Error(error.message);
		}
	},
};

export const ticketToggleLabel = {
	name: 'ticketToggleLabel',
	description: 'Toggle a label on a chat channel.',
	type: TicketTC,
	kind: 'mutation',
	args: {
		ticket: 'MongoID!',
		label: 'EnumTicketLabels!',
	},
	resolve: async (_, { ticket, label }, { models: { Ticket }, stream }) => {
		try {
			const channel = stream.chat.channel('messaging', ticket.toString());

			await channel.watch();

			let labels = channel.data?.labels || [];

			if (labels.includes(label)) {
				labels = channel.data.labels.filter(l => l !== label);
			} else {
				labels = [...new Set([...labels, label])];
			}

			await channel.update({
				...channel.data,
				labels,
			});

			return await Ticket.findByIdAndUpdate(
				ticket,
				{
					labels,
				},
				{
					new: true,
				}
			);
		} catch (error) {
			throw new Error(error.message);
		}
	},
};
