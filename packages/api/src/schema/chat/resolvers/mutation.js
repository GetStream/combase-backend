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
	args: { user: 'String!' },
	resolve: async (_, { user }, { models: { Chat }, organization, stream }) => {
		try {
			const { _doc: chat } = await Chat.create({
				organization,
				user,
			});

			await stream.chat
				.channel('messaging', chat._id.toString(), {
					created_by_id: user, // eslint-disable-line camelcase
					members: [user],
				})
				.create();

			return chat;
		} catch (error) {
			throw new Error(`Chat creation failed: ${error.message}`);
		}
	},
};
