import mongoose from 'mongoose';
import { StreamChat } from 'stream-chat';

import { Models } from 'api/schema';
import { isAgentAvailableIntl } from 'utils/isAgentAvailableIntl';

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

	addToChat = (agentId, channel) => {
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

		const updateChat = Models.Chat.findByIdAndUpdate(
			channel.id,
			{
				$addToSet: {
					agents: [agentId],
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

		const availableAgents = agents.filter(agent => {
			const available = isAgentAvailableIntl(agent);

			if (available) return agent;

			return null;
		});

		/*
		 * arr of available agents
		 * need to balance by tickets open/completed
		 * then pick rand if array is > 1
		 */
		// eslint-disable-next-line no-console
		console.log(availableAgents);

		const agent = availableAgents?.[0];

		if (!agent) return this.setAgentUnavailable(channel);

		return this.addToChat(agent._id, channel);
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
