import { hasOrganization, scopeOrganization } from 'utils/wrapResolve';

import './relations';
import './extend';
import resolvers from './resolvers';
import { AgentTC } from './model';

const Query = {
	agentById: AgentTC.mongooseResolvers.findById(),
	agentByIds: AgentTC.mongooseResolvers.findByIds(),
	agentOne: AgentTC.mongooseResolvers.findOne(),
	agentMany: AgentTC.mongooseResolvers.findMany().wrapResolve(hasOrganization).wrapResolve(scopeOrganization),
	agentCount: AgentTC.mongooseResolvers.count(),
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
