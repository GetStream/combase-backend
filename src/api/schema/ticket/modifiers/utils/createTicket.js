import schemaComposer from 'api/schema/composer';

export const wrapTicketCreate = newResolver => {
	const itc = newResolver.schemaComposer.getITC('CreateOneTicketInput').clone('CreateTicketInput');

	itc.addFields({
		organization: 'MongoID',
		message: 'String',
	});

	newResolver.setArgType('record', itc);
	newResolver.addArgs({
		user: newResolver.schemaComposer.getOTC('User').getInputTypeComposer().makeFieldNullable('organization').makeOptional(),
	});

	const outputType = newResolver.getTypeComposer().clone('CreateTicketAndUserPayload');

	outputType.addFields({
		user: 'CreateOneUserPayload',
	});

	return newResolver.clone('CreateTicketAndUser').setType(outputType);
};

export const wrapTicketCreateResolve = next => async rp => {
	let userId = rp.args.record?.user;
	let user;

	const UserTC = schemaComposer.getOTC('User');

	if (!userId && rp.args?.user) {
		const record = {
			...rp.args.user,
			organization: rp.context.organization,
		};

		user = await UserTC.getResolver('getOrCreate').resolve({
			source: undefined,
			args: { record },
			context: rp.context,
			info: rp.info,
		});

		userId = user.record._id.toString();
	} else {
		user = await UserTC.getResolver('get').resolve({
			source: undefined,
			args: { _id: userId },
			context: rp.context,
			info: rp.info,
		});
	}

	if (!user) {
		throw new Error('userGetOrCreate failed.');
	}

	// eslint-disable-next-line no-param-reassign
	rp.args.record.organization = rp.context.organization;
	// eslint-disable-next-line no-param-reassign
	rp.args.record.user = userId;
	// eslint-disable-next-line no-param-reassign
	rp.args.record.subject = rp.args.record.message;
	// eslint-disable-next-line callback-return
	const data = await next(rp);

	return {
		...data,
		user,
	};
};
