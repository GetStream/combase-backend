import { StreamChat } from 'stream-chat';

const chatCommands = [
	{
		args: '',
		description: 'Mark this ticket as closed or open.',
		name: 'mark',
		set: 'combase_set',
	},
	{
		args: '[level{0,1,2}]',
		description: 'Set the priority level of this ticket.',
		name: 'priority',
		set: 'combase_set',
	},
	{
		args: '',
		description: 'Star this ticket.',
		name: 'star',
		set: 'combase_set',
	},
	{
		args: '[tag name]',
		description: 'Add a tag to this ticket.',
		name: 'tag',
		set: 'combase_set',
	},
	{
		args: '',
		description: 'Transfer this ticket to another agent.',
		name: 'transfer',
		set: 'combase_set',
	},
];

/**
 * Keeps the Combase organization data in sync with Stream as a Stream Chat user, for use in system messages & auto-replies.
 */
export const createOrgChatCustomizations = async (resolve, source, args, context, info) => {
	const data = await resolve(source, args, context, info);

	try {
		let client = context.stream?.chat;

		if (!client && args.record?.stream?.key && args.record?.stream?.secret) {
			/*
			 * If stream chat is not in context, its likely the org is being created for the first time,
			 * In which case the unencrypted keys will be on the args object, which we cna use to create a chat client.
			 */

			client = new StreamChat(args.record?.stream?.key, args.record?.stream?.secret);
		}

		await Promise.all([
			...chatCommands.map(cmd => client.createCommand(cmd)),
			client.updateAppSettings({
				webhook_url: 'https://combase-webhooks.ngrok.io/webhook',
				custom_action_handler_url: `https://combase-api.ngrok.io/webhook-commands?organization=${data.record._id.toString()}&type={type}`,
			}),
		]);

		return data;
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error.message);

		return data;
	}
};
