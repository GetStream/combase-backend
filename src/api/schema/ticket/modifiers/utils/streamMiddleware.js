export const createChannel = () => async (resolve, source, args, context, info) => {
	if (!context.organization) {
		throw new Error('Unauthenticated.');
	}

	if (!context.stream.chat) {
		throw new Error('No Stream Chat Client available on context object.');
	}

	const res = await resolve(source, args, context, info);

	const { chat } = context.stream;
	const { _doc } = res.record;

	const channel = chat.channel('combase', _doc._id.toString(), {
		members: [_doc.user.toString()],
		created_by_id: _doc.user.toString(),
		organization: context.organization.toString(),
		status: 'new',
		starred: false,
		priority: 0,
		tags: null,
	});

	await channel.create();

	if (args?.record?.message) {
		channel.sendMessage({
			text: args.record.message,
			user_id: _doc.user.toString(),
		});
	}

	return res;
};

export const syncChannel = (fields = ['priority', 'starred', 'tags', 'status']) => async (resolve, source, args, context, info) => {
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

	await context.stream.chat.channel('combase', _doc._id.toString()).updatePartial({
		set: syncObj,
	});

	return res;
};
