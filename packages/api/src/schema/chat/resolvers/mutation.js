import { ChatTC } from '../model';
import { PubSub } from 'utils/pubsub';

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

			const cid = chat._id.toString();

			await stream.chat
				.channel('messaging', cid, {
					created_by_id: user, // eslint-disable-line camelcase
					members: [user],
				})
				.create();

			/*
			 *
			 * Fire internal PubSub to trigger the routing mechanism.
			 */
			await PubSub.publish('INTERNAL_EVENT.CHAT_CREATED', {
				chat: cid,
			});

			return chat;
		} catch (error) {
			throw new Error(`Chat creation failed: ${error.message}`);
		}
	},
};
