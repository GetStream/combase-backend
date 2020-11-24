import mongoose from 'mongoose';
import { StreamChat } from 'stream-chat';
import getDay from 'date-fns/getDay';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import { utcToZonedTime } from 'date-fns-tz';

import { Models } from 'api/schema';

export default class CombaseRoutingPlugin {
	setAgentUnavailable = channel => {
		/*
		 * const updateChannel = channel.update(
		 * 	{
		 * 		...channel.data,
		 * 		status: 'unassigned',
		 * 	},
		 * 	{
		 * 		subtype: 'agent_unavailable',
		 * 		text: `All agents are currently unavailable. An agent will get back to you shortly via email.`,
		 * 	}
		 * );
		 */

		const updateChat = Models.Chat.findByIdAndUpdate(
			channel.id,
			{
				status: 'unassigned',
			},
			{ new: true }
		);

		return Promise.all([updateChat]);
	};

	addToChat = (agent, channel) => {
		if (!agent) return this.setAgentUnavailable(channel);

		// This should never happen as routing only fires on new chats, but here as a failsafe.
		if (channel.state.members[agent]) {
			// eslint-disable-next-line no-console
			console.log(`'agent:${agent} is already in this channel'`);

			return;
		}

		const addMember = channel.addModerators([agent]);

		const updateChannel = channel.update(
			{
				...channel.data,
				status: 'open',
			},
			{
				subtype: 'agent_added',
				text: `An agent joined the chat.`,
				user_id: agent, // eslint-disable-line camelcase
			}
		);

		const updateChat = Models.Chat.findByIdAndUpdate(
			channel.id,
			{
				$addToSet: {
					agents: [agent],
				},
				status: 'open',
			},
			{ new: true }
		);

		return Promise.all([addMember, updateChannel, updateChat]);
	};

	findAvailableAgent = async event => {
		const { id: channelId, organization, type: channelType } = event.channel;

		const { stream: streamCreds } = await Models.Organization.findOne({ _id: organization }, { stream: true });

		const [channel] = await this.getChannel(channelType, channelId, streamCreds);

		const agents = await Models.Agent.aggregate([
			{
				$match: {
					active: true,
					// eslint-disable-next-line new-cap
					organization: mongoose.Types.ObjectId(organization),
				},
			},
			{
				$project: {
					_id: true,
					name: true,
					title: true,
					role: true,
					avatar: true,
					hours: true,
					timezone: true,
					chats: true,
				},
			},
			{
				$lookup: {
					from: 'chats',
					localField: '_id',
					foreignField: 'agents',
					as: 'chats',
				},
			},
			{
				$project: {
					_id: true,
					name: true,
					title: true,
					role: true,
					hours: true,
					timezone: true,
					tickets: {
						open: {
							$size: {
								$filter: {
									input: '$chats',
									cond: {
										$eq: ['$$this.status', 'open'],
									},
								},
							},
						},
						closed: {
							$size: {
								$filter: {
									input: '$chats',
									cond: {
										$eq: ['$$this.status', 'closed'],
									},
								},
							},
						},
					},
				},
			},
		]);

		const now = new Date();
		const todayNo = getDay(now);

		const availableAgents = agents
			.map(agent => {
				const { hours, timezone } = agent;

				// If the agent has set hours
				if (hours.length) {
					// If hours are set for the agent, but the current day is either disabled or non-existent, return as unavailable.
					const today = hours.find(({ day }) => day === todayNo);

					if (!today?.enabled) {
						return;
					}

					/*
					 * Take the generate start and end values and create a new Date object for each
					 * This ensures the day/month/year matches the users comparison date regardless of locale
					 * Then we can use utcToZonedTime and pass the organizations timezone so that it is returned as the correct time in the users timezone.
					 */
					const zonedStart = utcToZonedTime(new Date().setUTCHours(today.start.hour, today.start.minute, 0, 0), timezone);
					const zonedEnd = utcToZonedTime(new Date().setUTCHours(today.end.hour, today.end.minute, 0, 0), timezone);

					const available = isAfter(now, zonedStart) && isBefore(now, zonedEnd);

					if (available) return agent;
				}

				return agent;
			})
			.filter(a => {
				if (typeof a !== 'undefined') return a;
			});

		/*
		 * arr of available agents
		 * need to balance by tickets open/completed
		 * then pick rand if array is > 1
		 */
		// eslint-disable-next-line no-console
		console.log(availableAgents);

		//const agent = availableAgents[0];

		//if (!agent) return this.setAgentUnavailable(channel);

		//return this.addToChat(agent[0].id, channel);
	};

	getChannel = async (channelType, channelId, { key, secret }) => {
		const streamChat = new StreamChat(key, secret);

		const channel = streamChat.channel(channelType, channelId);

		await channel.watch({ state: true });

		return [channel, streamChat];
	};

	receive = async (req, res, next) => {
		if (req.headers['target-agent'] === 'Stream Webhook Client') {
			const { body: event } = req;

			switch (event.type) {
				case 'channel.created':
					// TODO We should add custom data to the channel from the createChat mutation such as keywords from the chat.
					await this.findAvailableAgent(event);

					return next();
				default:
					return next();
			}
		}
	};
}
