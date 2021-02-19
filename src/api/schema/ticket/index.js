import './extend';
import userResolvers from 'api/schema/user/resolvers';
import { UserTC } from 'api/schema/user/model';
import { organizationFilter } from 'utils/resolverMiddlewares/scopes';

import { createChannel, syncChannel } from './middlewares/stream';
import resolvers from './resolvers';
import { TicketTC } from './model';

const Query = {
	ticket: TicketTC.mongooseResolvers.findById(),
	tickets: TicketTC.mongooseResolvers.connection(),
	ticketCount: TicketTC.mongooseResolvers.count(),
	...resolvers.Query,
};

const wrapTicketCreate = newResolver => {
	const itc = newResolver.schemaComposer.getITC('CreateOneTicketInput').clone('CreateTicketInput');

	itc.addFields({
		organization: 'MongoID',
		message: 'String',
	});

	newResolver.setArgType('record', itc);
	newResolver.addArgs({
		user: UserTC.getInputTypeComposer().makeFieldNullable('organization').makeOptional(),
	});

	const outputType = newResolver.getTypeComposer().clone('CreateTicketAndUserPayload');

	outputType.addFields({
		user: 'CreateOneUserPayload',
	});

	return newResolver.clone('CreateTicketAndUser').setType(outputType);
};

const wrapTicketCreateResolve = next => async rp => {
	let userId = rp.args.record?.user;
	let user;

	if (!userId && rp.args?.user) {
		const record = {
			...rp.args.user,
			organization: rp.context.organization,
		};

		user = await userResolvers.Mutation.getOrCreate().resolve({
			source: undefined,
			args: { record },
			context: rp.context,
			info: rp.info,
		});

		userId = user.record._id.toString();
	} else {
		user = await UserTC.mongooseResolvers.findById().resolve({
			source: undefined,
			args: { _id: userId },
			context: rp.context,
			info: rp.info,
		});
	}

	if (!user) {
		throw new Error('No user provided.');
	}

	// eslint-disable-next-line no-param-reassign
	rp.args.record.organization = rp.context.organization;
	// eslint-disable-next-line no-param-reassign
	rp.args.record.user = userId;
	// eslint-disable-next-line callback-return
	const data = await next(rp);

	return {
		...data,
		user,
	};
};

const Mutation = {
	ticketCreate: TicketTC.mongooseResolvers
		.createOne()
		.wrap(wrapTicketCreate)
		.wrapResolve(wrapTicketCreateResolve)
		.withMiddlewares([createChannel()]),
	ticketUpdate: TicketTC.mongooseResolvers.updateById().withMiddlewares([syncChannel()]),
	ticketRemove: TicketTC.mongooseResolvers.removeById(),
	ticketRemoveMany: TicketTC.mongooseResolvers.removeMany().withMiddlewares([organizationFilter]),
	...resolvers.Mutation,
};

const Subscription = {
	...resolvers.Subscription,
};

export default {
	Query,
	Mutation,
	Subscription,
};
