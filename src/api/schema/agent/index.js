import './relations';
import './extend';
import resolvers from './resolvers';
import { AgentTC } from './model';
import { isAuthedAgent } from 'utils/resolverMiddlewares/auth';
import { organizationFilter } from 'utils/resolverMiddlewares/scopes';

const Query = {
	agentById: AgentTC.mongooseResolvers.findById().withMiddlewares([organizationFilter]),
	agentByIds: AgentTC.mongooseResolvers.findByIds().withMiddlewares([isAuthedAgent, organizationFilter]),
	agentMany: AgentTC.mongooseResolvers.findMany().withMiddlewares([isAuthedAgent, organizationFilter]),
	agentCount: AgentTC.mongooseResolvers.count().withMiddlewares([isAuthedAgent, organizationFilter]),
	...resolvers.Query,
};

const Mutation = {
	agentCreateOne: AgentTC.mongooseResolvers.createOne(),
	agentCreateMany: AgentTC.mongooseResolvers.createMany(),
	agentUpdateById: AgentTC.mongooseResolvers.updateById(),
	agentUpdateOne: AgentTC.mongooseResolvers.updateOne(),
	agentUpdateMany: AgentTC.mongooseResolvers.updateMany(),
	agentRemoveById: AgentTC.mongooseResolvers.removeById(),
	agentRemoveOne: AgentTC.mongooseResolvers.removeOne(),
	agentRemoveMany: AgentTC.mongooseResolvers.removeMany(),
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
