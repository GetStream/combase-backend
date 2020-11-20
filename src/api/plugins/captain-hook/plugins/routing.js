import { StreamChat } from 'stream-chat';
import { Models } from 'api/schema';

export default class CombaseRoutingPlugin {
	setAgentUnavailable = channel => {

		// const updateChannel = channel.update(
		// 	{
		// 		...channel.data,
		// 		status: 'unassigned',
		// 	},
		// 	{
		// 		subtype: 'agent_unavailable',
		// 		text: `All agents are currently unavailable. An agent will get back to you shortly via email.`,
		// 	}
		// );

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

		const available = Models.Agent.find(
			{
				organization,
				active: true,
			},
			{
				_id: true,
				name: true,
				hours: true,
			}
		);

		const agg = Models.Agent.aggregate([
			{
				$project: {
					name: true,
					hours: true,
					timezone: true,
					active: true,
				}
			}
		  ]);
		  

		/**
		 * !	Decide on the most suitable agent
		 * *	Keywords on channel object
		 * *	Current open chat count.
		 * *	Groups the Agent is in, in relation to the chat (maybe the URL the user is viewing too.)
		 */

		console.log('do routing', available);

		//return agents[0]?.id;

		//if (!agent) return this.setAgentUnavailable(channel);

		return this.addToChat('5fb590546d195aeb4dd65113', channel);
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
