/**
 * Keeps the Combase organization data in sync with Stream as a Stream Chat user, for use in system messages & auto-replies.
 */
export const syncOrganizationProfile = async (resolve, source, args, context, info) => {
	if (!context.organization) {
		throw new Error('Unauthorized.');
	}

	const data = await resolve(source, args, context, info);

	const { _doc } = data.record;

	try {
		await context.stream.chat.setUser({
			avatar: _doc.branding.logo,
			email: _doc.contact.email,
			id: _doc._id.toString(),
			name: _doc.name,
			entity: 'organization',
		});
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error.message);
	}

	return data;
};
