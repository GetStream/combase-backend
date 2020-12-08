import mongoose from 'mongoose';
import { StreamChat } from 'stream-chat';

import { Models } from 'api/schema';
import { isAgentAvailableIntl } from 'utils/isAgentAvailableIntl';

const delay = (wait = 500) => new Promise(res => setTimeout(res, wait));

export class CombaseRoutingPlugin {
	maxOpenChats = 5;

	setAgentUnavailable = async channel => {
		channel.addModerators([channel.data.organization]);

		await Models.Ticket.findByIdAndUpdate(
			channel.id,
			{
				type: 'ticket',
				status: 'unassigned',
			},
			{ new: true }
		);

		await this.streamChat.setUser({ id: channel.data.organization });

		await channel.sendMessage({
			text: `Hey! Sorry, all of our agents are unavailable right now.`,
		});

		await channel.keystroke();

		await delay(2000);

		await channel.sendMessage({
			text: `You'll get a notification as soon as the ticket is assigned, feel free to add some more information in the meantime!`,
		});

		await Promise.all([channel.stopTyping, channel.stopWatching, this.streamChat.disconnect]);
	};

	addToChat = async (agentId, channel) => {
		if (!agentId) return this.setAgentUnavailable(channel);

		// This should never happen as routing only fires on new chats, but here as a failsafe.
		if (channel.state.members[agentId]) {
			// eslint-disable-next-line no-console
			console.log(`'agent:${agentId} is already in this channel'`);

			return;
		}

		const addMember = channel.addModerators([agentId]);

		const updateChannel = channel.update(
			{
				...channel.data,
				status: 'open',
			},
			{
				subtype: 'agent_added',
				text: `An agent joined the chat.`,
				user_id: agentId, // eslint-disable-line camelcase
			}
		);

		const updateChat = await Models.Ticket.findByIdAndUpdate(
			channel.id,
			{
				$addToSet: {
					agents: [agentId],
				},
				type: 'chat',
				status: 'open',
			},
			{ new: true }
		);

		return Promise.all([addMember, updateChannel, updateChat]);
	};

	getChannel = async (channelType, channelId, { key, secret }) => {
		this.streamChat = new StreamChat(key, secret);

		const channel = this.streamChat.channel(channelType, channelId);

		await channel.watch({ state: true });

		return [channel, this.streamChat];
	};

	onChannelCreated = async payload => {
		const { data: event, organization } = payload;

		const { id: channelId, type: channelType } = event.channel;

		const { stream: streamCreds } = await Models.Organization.findOne({ _id: organization._id }, { stream: true });

		const [channel] = await this.getChannel(channelType, channelId, streamCreds);

		const agents = await Models.Agent.aggregate([
			{
				$match: {
					active: true,
					// eslint-disable-next-line new-cap
					organization: mongoose.Types.ObjectId(organization._id),
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
				},
			},
			{
				$lookup: {
					from: 'tickets',
					localField: '_id',
					foreignField: 'agents',
					as: 'allTickets',
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
									input: '$allTickets',
									cond: {
										$eq: ['$$this.status', 'open'],
									},
								},
							},
						},
						closed: {
							$size: {
								$filter: {
									input: '$allTickets',
									cond: {
										$eq: ['$$this.status', 'closed'],
									},
								},
							},
						},
					},
				},
			},
			{
				$match: {
					'tickets.open': {
						$lt: this.maxOpenChats, // Filter out all agents with more open conversations than the allowed maxOpenChats value.
					},
				},
			},
			{
				$sort: {
					'tickets.open': 1, // Least tickets is first in the array.
				},
			},
		]);

		const availableAgents = agents.filter(agent => {
			const available = isAgentAvailableIntl(agent);

			if (available) return agent;

			return null;
		});

		let agent;

		/** No Agents - Set Unavailable */
		if (!availableAgents?.length) return this.setAgentUnavailable(channel, organization._id.toString());

		/** Only 1 agent - Assign to this agent */
		if (availableAgents.length === 1) agent = availableAgents?.[0];

		/** Multiple Available Agents - Decide on the most suitable agent */
		if (availableAgents.length > 1) {
			/*
			 * should handle an array available agents (more than 1)
			 * need to balance by tickets open/completed
			 * then pick rand
			 */

			const randIdx = Math.floor(Math.random() * availableAgents.length);

			// TEMP: Replace with the above sorting/find mechanism.
			agent = availableAgents[randIdx];
		}

		return this.addToChat(agent._id, channel);
	};

	test = payload => {
		const { data } = payload;

		return data?.type && data?.type === 'channel.created';
	};

	listen = async capn => {
		const events = capn.listen(this.test);

		for await (const event of events) {
			await this.onChannelCreated(event);
		}
	};
}
