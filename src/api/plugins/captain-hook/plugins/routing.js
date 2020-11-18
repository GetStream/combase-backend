import { StreamChat } from 'stream-chat';
import { Models } from 'api/schema';

export default class CombaseRoutingPlugin {
	addToChat = (agent, channel) => {
		if (!agent) {
			// eslint-disable-next-line no-console
			console.log('No available agents.');

			return;
		}

		// This should never happen as it only fires on new chats
		if (channel.state.members[agent]) {
			// eslint-disable-next-line no-console
			console.log('the agent already in this channel');

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

		const [channel, client] = await this.getChannel(channelType, channelId, streamCreds);

		const { users } = await client.queryUsers({
			organization,
			type: 'agent',
		});

		const agent = this.selectAgent(users);

		if (!agent) return;

		return this.addToChat(agent, channel);
	};

	getChannel = async (channelType, channelId, { key, secret }) => {
		const streamChat = new StreamChat(key, secret);

		const channel = streamChat.channel(channelType, channelId);

		await channel.watch({ state: true });

		return [channel, streamChat];
	};

	selectAgent = agents => {
		// eslint-disable-next-line no-console
		console.log('available agents:', agents);

		/**
		 * !	Decide on the most suitable agent
		 * *	Keywords on channel object
		 * *	Current open chat count.
		 * *	Groups the Agent is in, in relation to the chat (maybe the URL the user is viewing too.)
		 */

		return agents[0]?.id;
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
