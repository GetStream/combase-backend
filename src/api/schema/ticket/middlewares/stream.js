export const syncChannel = (fields = ['priority', 'starred']) => async (resolve, source, args, context, info) => {
	if (!context.organization) {
		throw new Error('Unauthenticated.');
	}

	if (!context.stream.chat) {
		throw new Error('No Stream Chat Client available on context object.');
	}

	const res = await resolve(source, args, context, info);

	const syncObj = {};

	const { _doc } = res.record;

	fields.forEach(field => {
		syncObj[field] = _doc[field];
	});

	await context.stream.chat.channel('messaging', _doc._id.toString()).updatePartial({
		set: syncObj,
	});

	return res;
};
