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

		const now = new Date();
		const userTimezone = 'Europe/Amsterdam';
		const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

		const agents = await Models.Agent.aggregate([
			{
				$match: {
					active: true,
					organization: organization._id,
					'schedule.tuesday': {
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
															year: 2020,
															hour: '$$today.start.hour',
															minute: '$$today.start.minute',
															timezone: '$timezone',
														},
													},
													endTime: {
														$dateFromParts: {
															year: 2020,
															hour: '$$today.end.hour',
															minute: '$$today.end.minute',
															timezone: '$timezone',
														},
													},
													userTime: {
														$dateFromParts: {
															year: 2020,
															// isoDayOfWeek: now.getDay() === 0 ? 7 : now.getDay(),
															hour: now.getHours(),
															minute: now.getMinutes() + 1,
															timezone: userTimezone,
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
