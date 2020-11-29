import mongoose from 'mongoose';
import { StreamChat } from 'stream-chat';

import { Models } from 'api/schema';
import { isAgentAvailableIntl } from 'utils/isAgentAvailableIntl';

export class CombaseRoutingPlugin {
	setAgentUnavailable = async channel => {
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

		const updateTicket = await Models.Ticket.findByIdAndUpdate(
			channel.id,
			{
				type: 'ticket',
				status: 'unassigned',
			},
			{ new: true }
		);

		return Promise.all([updateTicket]);
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
		const streamChat = new StreamChat(key, secret);

		const channel = streamChat.channel(channelType, channelId);

		await channel.watch({ state: true });

		return [channel, streamChat];
	};

	receive = async payload => {
		const { data: event } = payload;

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
					tickets: true,
				},
			},
			{
				$lookup: {
					from: 'tickets',
					localField: '_id',
					foreignField: 'agents',
					as: 'tickets',
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
									input: '$tickets',
									cond: {
										$eq: ['$$this.status', 'open'],
									},
								},
							},
						},
						closed: {
							$size: {
								$filter: {
									input: '$tickets',
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

		// eslint-disable-next-line no-console
		console.log(availableAgents);

		let agent;

		/** No Agents - Set Unavailable */
		if (!availableAgents?.length) return this.setAgentUnavailable(channel);

		/** Only 1 agent - Assign to this agent */
		if (availableAgents.length === 1) agent = availableAgents?.[0];

		/** Multiple Available Agents - Decide on the most suitable agent */
		if (availableAgents.length > 1) {
			/*
			 * should handle an array available agents (more than 1)
			 * need to balance by tickets open/completed
			 * then pick rand
			 */

			// TEMP: Replace with the above sorting/find mechanism.
			agent = availableAgents[0];
		}

		return this.addToChat(agent._id, channel);
	};

	test({ data }) {
		return data?.type && data?.type === 'channel.created';
	}
}
