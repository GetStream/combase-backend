import { StreamChat } from 'stream-chat';

/**
 * Keeps the Combase organization data in sync with Stream as a Stream Chat user, for use in system messages & auto-replies.
 */
export const syncOrganizationProfile = async (resolve, source, args, context, info) => {
	const data = await resolve(source, args, context, info);

	const { _doc } = data.record;

	try {
		let client = context.stream?.chat;

		if (!client && args.record?.stream?.key && args.record?.stream?.secret) {
			/*
			 * If stream chat is not in context, its likely the org is being created for the first time,
			 * In which case the unencrypted keys will be on the args object, which we cna use to create a chat client.
			 */

			client = new StreamChat(args.record?.stream?.key, args.record?.stream?.secret);
		}

		await client.setUser({
			avatar: _doc.branding.logo,
			email: _doc.contact.email,
			id: _doc._id.toString(),
			name: _doc.name,
			entity: 'organization',
		});

		return data;
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error.message);

		return data;
	}
};
