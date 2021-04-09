import mongoose from 'mongoose';
import { deepmerge } from 'graphql-compose';
import { createAddTagResolver, createRemoveTagResolver } from 'utils/createTaggableEntity';

import { TicketModel as Ticket } from '../model';
import { createChannel, syncChannel, wrapTicketCreate, wrapTicketCreateResolve } from './utils';
import { logger } from 'utils/logger';

export const ticketCreate = tc =>
	tc.mongooseResolvers
		.createOne()
		.wrap(wrapTicketCreate)
		.wrapResolve(wrapTicketCreateResolve)
		.withMiddlewares([createChannel()])
		.clone({ name: 'create' });

export const ticketUpdate = tc => tc.mongooseResolvers.updateById().withMiddlewares([syncChannel()]).clone({ name: 'update' });

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
				const channel = stream.chat.channel('combase', ticket.toString());

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

export const ticketTransfer = tc =>
	tc.schemaComposer.createResolver({
		name: 'transfer',
		kind: 'mutation',
		type: tc,
		args: {
			_id: 'MongoID!',
			agent: 'MongoID!',
		},
		resolve: async rp => {
			try {
				const { _id, agent } = rp.args;

				if (!rp.context.agent || !rp.context.organization) {
					throw new Error('Unauthorized');
				}

				const { stream } = rp.context;

				const tickets = mongoose.model(tc.getTypeName());

				const exists = await tickets.countDocuments({
					_id,
					agents: {
						$in: [agent],
					},
				});

				if (exists) {
					throw new Error(`${agent} is already a member on this ticket.`);
				}

				const channel = stream.chat.channel('combase', _id.toString());

				// Reassign
				await Promise.all([
					channel.addMembers([agent]),
					tickets.findByIdAndUpdate(_id, {
						$addToSet: { agents: [agent] },
					}),
				]);

				// Remove Self
				const [, ticket] = await Promise.all([
					channel.removeMembers([rp.context.agent]),
					tickets.findByIdAndUpdate(
						_id,
						{
							$pull: { agents: { $in: [rp.context.agent] } },
						},
						{ new: true }
					),
				]);

				//TODO: Ticket transferred activity (need to set up the trigger on the ingress.)
				return ticket;
			} catch (error) {
				logger.error(error.message);
			}
		},
	});

export const ticketAddTag = tc => createAddTagResolver(tc);

export const ticketRemoveTag = tc => createRemoveTagResolver(tc);
