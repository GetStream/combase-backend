import { ChatTC } from '../model';

/**
 * Takes the User _id (the customer using the widget) and the organization ID as
 * arguments. Then creates a channel with just the user (ready to be routed to an agent)
 * and returns the Chat object so we can connect to the channel on the client-side.
 */

export const createChat = {
	name: 'createChat',
	type: ChatTC,
	kind: 'mutation',
	args: {
		message: 'String!',
		user: 'MongoID!',
	},
	resolve: async (_, { message, user }, { models: { Chat }, organization, stream }) => {
		try {
			const { _doc: chat } = await Chat.create({
				organization,
				user,
			});

			await stream.chat.setUser({ id: user });

			const channel = stream.chat.channel('messaging', chat._id.toString(), {
				created_by_id: user, // eslint-disable-line camelcase
				members: [user],
			});

			await channel.create();

			channel.sendMessage({
				text: message,
				user_id: user, // eslint-disable-line camelcase
			});

			stream.chat.disconnect();

			return chat;
		} catch (error) {
			throw new Error(`Chat creation failed: ${error.message}`);
		}
	},
};

export const addToChat = {
	name: 'addToChat',
	type: ChatTC,
	kind: 'Mutation',
	args: {
		agent: 'MongoID!',
		chat: 'MongoID!',
	},
	resolve: async (_, { chat, agent }, { models: { Chat }, stream }) => {
		await stream.chat.channel('messaging', chat.toString()).addMembers([agent.toString()]);

		return Chat.updateById(chat, { $push: { agents: [agent] } }, { new: true }).lean();
	},
};
