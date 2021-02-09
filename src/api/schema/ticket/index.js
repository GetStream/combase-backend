import './extend';
import { organizationFilter } from 'utils/resolverMiddlewares/scopes';

import { syncChannel } from './middlewares/stream';
import resolvers from './resolvers';
import { TicketTC } from './model';

const Query = {
	ticketById: TicketTC.mongooseResolvers.findById(),
	ticketByIds: TicketTC.mongooseResolvers.findByIds(),
	ticketOne: TicketTC.mongooseResolvers.findOne(),
	ticketMany: TicketTC.mongooseResolvers.findMany(),
	ticketCount: TicketTC.mongooseResolvers.count(),
	...resolvers.Query,
};

const Mutation = {
	ticketCreateOne: TicketTC.mongooseResolvers.createOne(),
	ticketUpdateById: TicketTC.mongooseResolvers.updateById().withMiddlewares([syncChannel()]),
	ticketRemoveById: TicketTC.mongooseResolvers.removeById(),
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
