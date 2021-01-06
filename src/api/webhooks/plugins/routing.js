import mongoose from 'mongoose';
import { StreamChat } from 'stream-chat';

import { Models } from 'api/schema';

const delay = (wait = 500) => new Promise(res => setTimeout(res, wait));

export class CombaseRoutingPlugin {
	maxOpenChats = 5;

	constructor(capn) {
		this.capn = capn;
		this.listen();
	}

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
			text: `Sorry, all agents are currently unavailable.`,
		});

		await channel.keystroke();

		await delay(2000);

		await channel.sendMessage({
			text: `Feel free to add additional information and we'll follow up via email as soon as an agent is available.`,
		});

		await Promise.all([channel.stopTyping, channel.stopWatching, this.streamChat.disconnect]);
	};

	addToChat = async (agentId, channel) => {
		if (!agentId) return this.setAgentUnavailable(channel);

		// This should never happen as routing only fires on new chats, but here as a failsafe.
		if (channel.state.members[agentId]) return;

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
		const { data: event } = payload;

		const { id: channelId, type: channelType, organization } = event.channel;

		const { stream: streamCreds } = await Models.Organization.findOne({ _id: organization }, { stream: true });

		const [channel] = await this.getChannel(channelType, channelId, streamCreds);

		const now = new Date();
		const userTimezone = 'Europe/Amsterdam';
		const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

		const agents = await Models.Agent.aggregate([
			{
				$match: {
					active: true,
					// eslint-disable-next-line new-cap
					organization: mongoose.Types.ObjectId(organization),
					[`schedule.${dayName}`]: {
						$elemMatch: {
							enabled: true,
						},
					},
				},
			},
			{
				$project: {
					'name.display': true,
					email: true,
					role: true,
					avatar: true,
					timezone: '$$REMOVE',
					schedule: '$$REMOVE',
					available: {
						$anyElementTrue: {
							$map: {
								input: `$schedule.${dayName}`,
								as: 'today',
								in: {
									$cond: [
										{
											$let: {
												vars: {
													startTime: {
														$dateFromParts: {
															hour: '$$today.start.hour',
															minute: '$$today.start.minute',
															timezone: '$timezone',
															year: 2020,
														},
													},
													endTime: {
														$dateFromParts: {
															hour: '$$today.end.hour',
															minute: '$$today.end.minute',
															timezone: '$timezone',
															year: 2020,
														},
													},
													userTime: {
														$dateFromParts: {
															hour: now.getHours(),
															minute: now.getMinutes() + 1,
															timezone: userTimezone,
															year: 2020,
														},
													},
												},
												in: {
													$and: [
														{
															$gt: ['$$userTime', '$$startTime'],
														},
														{
															$lt: ['$$userTime', '$$endTime'],
														},
													],
												},
											},
										},
										true,
										false,
									],
								},
							},
						},
					},
				},
			},
			{
				$match: {
					available: true,
				},
			},
		]);

		let agent;

		/** No Agents - Set Unavailable */
		if (!agents?.length) return this.setAgentUnavailable(channel, organization);

		/** Only 1 agent - Assign to this agent */
		if (agents.length === 1) agent = agents[0];

		/** Multiple Available Agents - Decide on the most suitable agent */
		if (agents.length > 1) {
			/*
			 * should handle an array available agents (more than 1)
			 * need to balance by tickets open/completed
			 * then pick rand
			 */

			const randIdx = Math.floor(Math.random() * agents.length);

			// TEMP: Replace with the above sorting/find mechanism.
			agent = agents[randIdx];
		}

		return this.addToChat(agent._id, channel);
	};

	test = payload => {
		const { data } = payload;

		return data?.type && data?.type === 'channel.created';
	};

	listen = async () => {
		const events = this.capn.listen();

		for await (const event of events) {
			// eslint-disable-next-line no-console
			console.log('Received:', event.data.type, event);

			if (this.test(event)) {
				await this.onChannelCreated(event);
			}
		}
	};
}
