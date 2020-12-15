import './extend';
import { organizationFilter } from 'utils/resolverMiddlewares/scopes';

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
	ticketCreateMany: TicketTC.mongooseResolvers.createMany(),
	ticketUpdateById: TicketTC.mongooseResolvers.updateById(),
	ticketUpdateOne: TicketTC.mongooseResolvers.updateOne(),
	ticketUpdateMany: TicketTC.mongooseResolvers.updateMany(),
	ticketRemoveById: TicketTC.mongooseResolvers.removeById(),
	ticketRemoveOne: TicketTC.mongooseResolvers.removeOne(),
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
