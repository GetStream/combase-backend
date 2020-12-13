import './relations';
import './extend';
import resolvers from './resolvers';
import { AgentTC } from './model';
import { enrichWithAuthToken, isAuthedAgent } from 'utils/resolverMiddlewares/auth';
import { syncAgentProfile } from 'utils/resolverMiddlewares/streamChat';
import { createAgentFeedRelationships } from 'utils/resolverMiddlewares/streamFeeds';
import { organizationFilter } from 'utils/resolverMiddlewares/scopes';

const Query = {
	agentById: AgentTC.mongooseResolvers.findById().withMiddlewares([organizationFilter]),
	agentMany: AgentTC.mongooseResolvers.findMany().withMiddlewares([isAuthedAgent, organizationFilter]),
	agentCount: AgentTC.mongooseResolvers.count().withMiddlewares([isAuthedAgent, organizationFilter]),
	...resolvers.Query,
};

const Mutation = {
	agentCreate: AgentTC.mongooseResolvers.createOne().withMiddlewares([createAgentFeedRelationships, syncAgentProfile, enrichWithAuthToken]),
	agentUpdate: AgentTC.mongooseResolvers.updateById().withMiddlewares([syncAgentProfile]),
	agentRemove: AgentTC.mongooseResolvers.removeById(),
	agentRemoveMany: AgentTC.mongooseResolvers.removeMany().withMiddlewares([organizationFilter]),
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
