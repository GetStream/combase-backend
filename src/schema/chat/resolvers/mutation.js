export const createChat = async (_, args, { user, organization, models: { Chat }, stream }) => {
	// eslint-disable-next-line no-console
	console.log(stream, user, organization);
	await Chat.create({ ...args });
};
