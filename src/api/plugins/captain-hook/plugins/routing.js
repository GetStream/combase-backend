import { StreamChat } from 'stream-chat';
import { Models } from 'api/schema';

export default class CombaseRoutingPlugin {
	getChannel = async (channelType, channelId, { key, secret }) => {
		const streamChat = new StreamChat(key, secret);

		const channel = streamChat.channel(channelType, channelId);

		await channel.watch();

		return channel;
	};

	findAgent = async event => {
		const { id: channelId, organization, type: channelType } = event.channel;

		const { stream: streamCreds } = await Models.Organization.findOne({ _id: organization }, { stream: true });

		// eslint-disable-next-line no-console
		console.log(`new chat:`, event.channel);

		const agent = await Models.Agent.findOne().lean();

		const channel = await this.getChannel(channelType, channelId, streamCreds);

		const addMember = channel.addModerators([agent._id.toString()]);

		const updateChannel = channel.update(
			{
				...channel.data,
				status: 'open',
			},
			{
				subtype: 'agent_added',
				text: `${agent?.name?.display || 'An agent'} joined the chat.`,
				user_id: agent._id.toString(), // eslint-disable-line camelcase
			}
		);

		const updateChat = Models.Chat.findByIdAndUpdate(
			channelId,
			{
				$push: {
					agents: [agent],
				},
				status: 'open',
			},
			{ new: true }
		);

		return Promise.all([addMember, updateChannel, updateChat]);
	};

	receive = async (req, res, next) => {
		if (req.headers['target-agent'] === 'Stream Webhook Client') {
			const { body: event } = req;

			switch (event.type) {
				case 'channel.created':
					await this.findAgent(event);

					return next();
				default:
					return next();
			}
		}
	};
}
