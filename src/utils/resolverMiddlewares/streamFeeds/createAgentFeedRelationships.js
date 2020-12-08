export const createAgentFeedRelationships = async (resolve, source, args, context, info) => {
	const data = await resolve(source, args, context, info);

	try {
		await context.stream.feeds.feed('organization', context.organization.toString()).follow('agent', data.record._id.toString());
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error.message);
	}

	return data;
};
