/**
 * Takes the User _id (the customer using the widget) and the organization ID as
 * arguments. Then creates a channel with just the user (ready to be routed to an agent)
 * and returns the Chat object so we can connect to the channel on the client-side.
 * /
 * We can probably use the organization ID from context down the road, but we need a way of
 * setting it from the widget.
 */

export const createChat = async (_, { user, organization }, { models: { Chat }, stream }) => {
	try {
		const { _doc: chat } = await Chat.create({ organization });

		await stream.chat
			.channel('messaging', chat._id, {
				members: [user],
			})
			.create();

		return chat;
	} catch (error) {
		throw new Error(`Chat creation failed: ${error.message}`);
	}
};
