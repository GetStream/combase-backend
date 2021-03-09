import { deepmerge } from 'graphql-compose';

import { TicketModel as Ticket, TicketModel } from '../model';
import { createChannel, syncChannel, wrapTicketCreate, wrapTicketCreateResolve } from './utils';

export const ticketCreate = tc =>
	tc.mongooseResolvers
		.createOne()
		.wrap(wrapTicketCreate)
		.wrapResolve(wrapTicketCreateResolve)
		.withMiddlewares([createChannel()])
		.clone({ name: 'create' });

export const ticketUpdate = tc => tc.mongooseResolvers.updateById().withMiddlewares([syncChannel()]).clone({ name: 'update' });

/*
 * TODO: Add Tag
 */
export const ticketAddTag = tc =>
	tc.schemaComposer.createResolver({
		name: 'addTag',
		type: tc,
		kind: 'mutation',
		args: {
			id: 'MongoID!',
			tag: 'MongoID!',
		},
		resolve: (_, args) =>
			TicketModel.findByIdAndUpdate(
				args?._id,
				{
					$addToSet: {
						tags: [args.tag],
					},
					status,
				},
				{ new: true }
			).lean(),
	});

export const ticketRemoveTag = tc =>
	tc.schemaComposer.createResolver({
		name: 'removeTag',
		type: tc,
		kind: 'mutation',
		args: {
			id: 'MongoID!',
			tag: 'MongoID!',
		},
		resolve: (_, args) =>
			TicketModel.findByIdAndUpdate(
				args?._id,
				{
					$pull: {
						tags: [args.tag],
					},
					status,
				},
				{ new: true }
			).lean(),
	});

export const ticketMarkAs = tc =>
	tc.mongooseResolvers
		.updateById()
		.removeArg('record')
		.addArgs({
			status: 'EnumTicketStatus!',
		})
		.wrapResolve(next => rp => next(deepmerge(rp, { args: { record: { status: rp?.args.status } } })))
		.withMiddlewares([syncChannel()])
		.clone({ name: 'markAs' });

export const ticketStar = tc =>
	tc.mongooseResolvers
		.updateById()
		.removeArg('record')
		.addArgs({
			starred: 'Boolean!',
		})
		.wrapResolve(next => rp => next(deepmerge(rp, { args: { record: { starred: rp?.args.starred } } })))
		.withMiddlewares([syncChannel()])
		.clone({ name: 'star' });

export const ticketSetPriority = tc =>
	tc.mongooseResolvers
		.updateById()
		.removeArg('record')
		.addArgs({
			level: 'Int!',
		})
		.wrapResolve(next => rp => next(deepmerge(rp, { args: { record: { priority: rp?.args.level } } })))
		.withMiddlewares([syncChannel()])
		.clone({ name: 'setPriority' });

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
