import mongoose from 'mongoose';
import { deepmerge } from 'graphql-compose';
import { createAddTagResolver, createRemoveTagResolver } from 'utils/createTaggableEntity';

import { TicketModel as Ticket, TicketModel } from '../model';
import { createChannel, syncChannel, syncChannelMany, wrapTicketCreate, wrapTicketCreateResolve } from './utils';
import { logger } from 'utils/logger';

export const ticketCreate = tc =>
	tc.mongooseResolvers
		.createOne()
		.wrap(wrapTicketCreate)
		.wrapResolve(wrapTicketCreateResolve)
		.withMiddlewares([createChannel(), tc.algoliaMiddlewares.sync])
		.clone({ name: 'create' });

export const ticketUpdate = tc =>
	tc.mongooseResolvers.updateById().withMiddlewares([syncChannel(), tc.algoliaMiddlewares.sync]).clone({ name: 'update' });
export const ticketUpdateMany = tc => tc.mongooseResolvers.updateMany().withMiddlewares([syncChannelMany()]).clone({ name: 'updateMany' });

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

export const ticketStarMany = tc =>
	tc.mongooseResolvers
		.updateMany()
		.removeArg('record')
		.removeArg('filter')
		.addArgs({
			_ids: '[MongoID!]!',
			starred: 'Boolean!',
		})
		.wrapResolve(next => rp =>
			next(
				deepmerge(rp, {
					args: {
						filter: {
							_operators: {
								_id: {
									in: rp.args._ids,
								},
							},
						},
						record: {
							starred: rp?.args.starred,
						},
					},
				})
			)
		)
		.withMiddlewares([syncChannelMany('starred')])
		.clone({ name: 'starMany' });

export const ticketSetStatus = tc =>
	tc.mongooseResolvers
		.updateById()
		.removeArg('record')
		.addArgs({
			status: 'EnumTicketStatus!',
		})
		.wrapResolve(next => rp => next(deepmerge(rp, { args: { record: { status: rp?.args.status } } })))
		.withMiddlewares([syncChannel()])
		.clone({ name: 'setStatus' });

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

export const ticketSetPriorityMany = tc =>
	tc.mongooseResolvers
		.updateMany()
		.removeArg('record')
		.removeArg('filter')
		.addArgs({
			_ids: '[MongoID!]!',
			level: 'Int!',
		})
		.wrapResolve(next => rp =>
			next(
				deepmerge(rp, {
					args: {
						filter: {
							_operators: {
								_id: {
									in: rp.args._ids,
								},
							},
						},
						record: {
							priority: rp.args.level,
						},
					},
				})
			)
		)
		.withMiddlewares([syncChannelMany('priority')])
		.clone({ name: 'setPriorityMany' });

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
		// TODO Show status has a default of open in playground
		resolve: async ({ args: { ticket, agent, status = 'open' }, context: { organization, stream } }) => {
			try {
				const channel = stream.chat.channel('combase', ticket.toString());

				const ticketData = await TicketModel.findById(ticket, { user: 1 });

				const userId = ticketData.user.toString();

				if (status === 'unassigned') {
					await channel.addModerators([organization]);

					// TODO: Fetch and replace below with the Org-level widget.unassignedMessages array.
					const unassignedMessages = [
						`Sorry, all agents are currently unavailable.`,
						`Feel free to add additional information and we'll follow up as soon as an agent is available.`,
						`Don't worry if you can't stick around! We'll follow up by email if you leave the page.`,
					];

					const response = await Ticket.findByIdAndUpdate(
						channel.id,
						{
							agents: [],
							status: 'unassigned',
						},
						{ new: true }
					);

					await channel.updatePartial({ set: { status } });

					// eslint-disable-next-line no-unused-vars
					for await (const text of unassignedMessages) {
						await channel.sendMessage({
							text,
							user_id: organization,
						});
						await new Promise(res => setTimeout(res, 1000));
					}

					return response;
				}

				// If agent is truthy and ticket is not being marked as unassigned.
				if (ticket && agent && status !== 'unassigned') {
					const agentId = agent.toString();

					const { members } = await channel.queryMembers({});

					if (members[agentId]) {
						throw new Error('That agent is already a member of this channel.');
					}

					const existingAgents = members.filter(({ user_id }) => userId !== user_id);

					await Promise.all(
						existingAgents.map(async ({ user_id }) => {
							await channel.demoteModerators([user_id]);
							await channel.removeMembers([user_id]);
						})
					);

					await channel.addMembers([agentId], {
						text: 'An agent joined the chat.',
						user_id: agentId,
					});

					await channel.updatePartial({ set: { status } });

					return Ticket.findByIdAndUpdate(
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

export const ticketSendMessage = tc =>
	tc.schemaComposer.createResolver({
		name: 'sendMessage',
		type: 'JSON',
		args: {
			text: 'String!',
			ticket: 'MongoID!',
			agent: 'MongoID',
		},
		kind: 'mutation',
		resolve: async ({
			args: { ticket, text, agent: argAgent },
			context: {
				agent,
				stream: { chat },
			},
		}) => {
			try {
				if (!agent && !argAgent) {
					throw new Error('Unauthenticated');
				}

				const data = await chat.channel('combase', ticket).sendMessage({
					text,
					user_id: agent || argAgent,
				});

				return data;
			} catch (error) {
				logger.error(error.message);
			}
		},
	});
