import pubsub from 'utils/pubsub';
import { ChatTC } from '../model';

/**
 * Takes the User _id (the customer using the widget) and the organization ID as
 * arguments. Then creates a channel with just the user (ready to be routed to an agent)
 * and returns the Chat object so we can connect to the channel on the client-side.
 * /
 * We can probably use the organization ID from context down the road, but we need a way of
 * setting it from the widget.
 */

export const createChat = {
	name: 'createChat',
	type: ChatTC,
	kind: 'mutation',
	args: {},
	resolve: async (_, { user, organization }, { models: { Chat }, stream }) => {
		try {
			const { _doc: chat } = await Chat.create({
				organization,
				user,
			});

			const cid = chat._id.toString();

			await stream.chat
				.channel('messaging', cid, {
					members: [user],
				})
				.create();

			// Fire internal PubSub to trigger the routing mechanism. Figure out how to send to the right queue...
			await pubsub.publish('INTERNAL_EVENT.CHAT_CREATED', {
				chat: cid,
			});

			return chat;
		} catch (error) {
			throw new Error(`Chat creation failed: ${error.message}`);
		}
	},
};
