import { TicketModel as Ticket } from '../model';
import { createChannel, syncChannel, wrapTicketCreate, wrapTicketCreateResolve } from './utils';

// TODOOOOOOOOOO
/**
 * Takes the User _id (the customer using the widget) and the organization ID as
 * arguments. Then creates a channel with just the user (ready to be routed to an agent)
 * and returns the ticket object so we can connect to the channel on the client-side.
 */

export const ticketCreate = tc =>
	tc.mongooseResolvers
		.createOne()
		.wrap(wrapTicketCreate)
		.wrapResolve(wrapTicketCreateResolve)
		.withMiddlewares([createChannel()])
		.clone({ name: 'create' });
export const ticketUpdate = tc => tc.mongooseResolvers.updateById().withMiddlewares([syncChannel()]).clone({ name: 'update' });
/*
 * export const ticketArchive = tc => tc.mongooseResolvers.updateById().withMiddlewares([syncChannel()]);
 * export const ticketArchiveMany = tc => tc.mongooseResolvers.updateById().withMiddlewares([syncChannel()]); // TODO
 */

export const ticketAssign = tc =>
	tc.schemaComposer.createResolver({
		name: 'assign',
		description:
			'Calling this resolver will assign a ticket to an agent. If no status argument is provided, the chat will be marked as open by default.',
		type: tc,
		kind: 'Mutation',
		args: {
			agent: 'MongoID',
			ticket: 'MongoID!',
			status: 'EnumTicketStatus',
		},
		// TODO Show status has a default of open
		resolve: async ({ args: { ticket, agent, status = 'open' }, context: { organization, stream } }) => {
			try {
				const channel = stream.chat.channel('messaging', ticket.toString());

				if (status === 'unassigned') {
					// TODO: Agents/Orgs should be able to override the content of these initial messages when unassigned.
					await channel.addModerators([organization]);

					await channel.sendMessage({
						text: `Sorry, all agents are currently unavailable.`,
						user_id: organization,
					});

					await channel.sendMessage({
						text: `Feel free to add additional information and we'll follow up as soon as an agent is available.`,
						user_id: organization,
					});

					await channel.sendMessage({
						text: `Don't worry if you can't stick around! We'll follow up by email if you leave the page.`,
						user_id: organization,
					});

					return Ticket.findByIdAndUpdate(
						channel.id,
						{
							agents: [],
							status: 'unassigned',
						},
						{ new: true }
					);
				}

				// If agent is truthy and ticket is not being marked as unassigned.
				if (ticket && agent && status !== 'unassigned') {
					const agentId = agent.toString();

					const { members } = await channel.queryMembers({ id: { $in: [agentId] } });

					if (members[agentId]) {
						throw new Error('That agent is already a member of this channel.');
					}

					const addMember = channel.addMembers([agentId], {
						text: 'An agent joined the chat.',
						user_id: agentId,
					});

					const updateChannel = channel.updatePartial({ set: { status } });

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
			} catch (error) {
				throw new Error(error.message);
			}
		},
	});

export const ticketAddLabel = tc =>
	tc.schemaComposer.createResolver({
		name: 'ticketAddLabel',
		description: 'Add a label to a chat channel.',
		type: tc,
		kind: 'mutation',
		args: {
			ticket: 'MongoID!',
			label: 'EnumTicketLabels!',
		},
		resolve: async ({ args: { ticket, label }, context: { stream } }) => {
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
	});

export const ticketRemoveLabel = tc =>
	tc.schemaComposer.createResolver({
		name: 'ticketRemoveLabel',
		description: 'Remove a label from a chat channel.',
		type: tc,
		kind: 'mutation',
		args: {
			ticket: 'MongoID!',
			label: 'EnumTicketLabels!',
		},
		resolve: async ({ args: { ticket, label }, context: { stream } }) => {
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
	});

export const ticketToggleLabel = tc =>
	tc.schemaComposer.createResolver({
		name: 'ticketToggleLabel',
		description: 'Toggle a label on a chat channel.',
		type: tc,
		kind: 'mutation',
		args: {
			ticket: 'MongoID!',
			label: 'EnumTicketLabels!',
		},
		resolve: async ({ args: { ticket, label }, context: { stream } }) => {
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
	});
