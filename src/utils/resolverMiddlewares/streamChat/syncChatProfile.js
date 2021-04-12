/**
 * Keeps the StreamChat user data in sync with mongo.
 */
export const syncChatProfile = (entity = 'User') => async (resolve, source, args, context, info) => {
	if (!context.organization) {
		throw new Error('Unauthenticated.');
	}

	const data = await resolve(source, args, context, info);

	const { _doc } = data.record;

	try {
		await context.stream.chat.upsertUser({
			avatar: _doc.avatar,
			email: _doc.email,
			id: _doc._id.toString(),
			name: typeof _doc.name === 'string' ? _doc.name : _doc.name.display,
			organization: _doc.organization.toString(),
			timezone: _doc.timezone,
			entity,
			meta: _doc.meta,
		});
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error.message);
	}

	return data;
};
