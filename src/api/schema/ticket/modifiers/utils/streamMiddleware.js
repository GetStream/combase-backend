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

export const syncChannel = (fields = ['priority', 'starred', 'tags', 'status', 'meta']) => async (resolve, source, args, context, info) => {
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

export const syncChannelMany = field => async (resolve, source, args, context, info) => {
	if (!field) {
		throw new Error('No field provided from which to sync with Stream Chat. i.e. "priority"');
	}

	if (!context.organization) {
		throw new Error('Unauthenticated.');
	}

	if (!context.stream.chat) {
		throw new Error('No Stream Chat Client available on context object.');
	}

	const res = await resolve(source, args, context, info);

	const channelIdsToUpdate = args._ids;

	// const { record: _doc } = args;

	// TODO: Not ideal - we can fix by changing the `level` arg to `priority` in the setPriority resolvers...
	const fieldSelector = field === 'priority' ? 'level' : field;

	const syncObj = {
		[field]: args[fieldSelector],
	};

	await Promise.all(
		channelIdsToUpdate.map(_id =>
			context.stream.chat.channel('combase', _id.toString()).updatePartial({
				set: syncObj,
			})
		)
	);

	return res;
};
