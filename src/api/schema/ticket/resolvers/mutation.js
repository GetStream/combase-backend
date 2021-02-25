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
			const status = 'new';
			const tags = [];

			const { _doc: ticket } = await Ticket.create({
				organization,
				user,
				status,
				tags,
			});

			const channel = stream.chat.channel('messaging', ticket._id.toString(), {
				members: [user],
				created_by_id: user,
				organization,
				status,
				tags,
			});

			await channel.create();

			if (message) {
				channel.sendMessage({
					text: message,
					user_id: user,
				});
			}

			return ticket;
		} catch (error) {
			throw new Error(`Ticket creation failed: ${error.message}`);
		}
	},
};

export const ticketAssign = {
	name: 'ticketAssign',
	description:
		'Calling this resolver will assign a ticket to an agent. If no status argument is provided, the chat will be marked as open by default.',
	type: TicketTC,
	kind: 'Mutation',
	args: {
		agent: 'MongoID',
		ticket: 'MongoID!',
		status: 'EnumTicketStatus',
	},
	// TODO Show status has a default of open
	resolve: async (_, { ticket, agent, status = 'open' }, { models: { Ticket }, stream }) => {
		try {
			const channel = stream.chat.channel('messaging', ticket.toString());

			await channel.watch({ state: true });

			if (status === 'unassigned') {
				// TODO: Agents/Orgs should be able to override the content of these initial messages when unassigned.
				channel.addModerators([channel.data.organization]);

				await Ticket.findByIdAndUpdate(
					channel.id,
					{
						agents: [],
						status: 'unassigned',
					},
					{ new: true }
				);

				await channel.sendMessage({
					text: `Sorry, all agents are currently unavailable.`,
					user_id: channel.data.organization,
				});

				await new Promise(res => setTimeout(res, 2000));

				await channel.sendMessage({
					text: `Feel free to add additional information and we'll follow up as soon as an agent is available.`,
					user_id: channel.data.organization,
				});

				await new Promise(res => setTimeout(res, 3000));

				await channel.sendMessage({
					text: `Don't worry if you can't stick around! We'll follow up by email if you leave the page.`,
					user_id: channel.data.organization,
				});

				return channel.stopWatching;
			}

			// If agent is truthy and ticket is not being marked as unassigned.
			if (ticket && agent && status !== 'unassigned') {
				if (channel.state.members[agent.toString()]) {
					throw new Error('That agent is already a member of this channel.');
				}

				const addMember = channel.addModerators([agent.toString()]);

				const updateChannel = channel.update(
					{
						...channel.data,
						status,
					},
					{
						subtype: 'agent_added',
						text: `An agent joined the chat.`,
						user_id: agent.toString(), // eslint-disable-line camelcase
					}
				);

				await Promise.all([addMember, updateChannel]);

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
			}

			throw new Error('Assigning Ticket Failed: Missing arguments.');
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
