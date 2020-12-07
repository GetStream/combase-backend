/**
 * Keeps the StreamChat agent user data in sync with mongo.
 */
export const syncAgentProfile = async (resolve, source, args, context, info) => {
	if (!context.organization) {
		throw new Error('Unauthorized.');
	}

	const data = await resolve(source, args, context, info);

	const { _doc } = data.record;

	try {
		await context.stream.chat.setUser({
			avatar: _doc.avatar,
			email: _doc.email,
			id: _doc._id.toString(),
			name: _doc.name.display,
			organization: _doc.organization.toString(),
			timezone: _doc.timezone,
			entity: 'agent',
		});
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error.message);
	}

	return data;
};