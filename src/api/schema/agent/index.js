import './relations';
import './extend';
import resolvers from './resolvers';
import { AgentTC } from './model';
import { enrichWithAuthToken, isAuthedAgent } from 'utils/resolverMiddlewares/auth';
import { syncAgentProfile } from 'utils/resolverMiddlewares/streamChat';
import { organizationFilter } from 'utils/resolverMiddlewares/scopes';

const Query = {
	agentById: AgentTC.mongooseResolvers.findById().withMiddlewares([organizationFilter]),
	agentMany: AgentTC.mongooseResolvers.findMany().withMiddlewares([isAuthedAgent, organizationFilter]),
	agentCount: AgentTC.mongooseResolvers.count().withMiddlewares([isAuthedAgent, organizationFilter]),
	...resolvers.Query,
};

const Mutation = {
	agentCreate: AgentTC.mongooseResolvers.createOne().withMiddlewares([syncAgentProfile, enrichWithAuthToken]),
	agentUpdate: AgentTC.mongooseResolvers.updateById().withMiddlewares([syncAgentProfile]),
	agentRemove: AgentTC.mongooseResolvers.removeById(),
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
