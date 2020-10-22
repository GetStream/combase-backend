import './relations';
import resolvers from './resolvers';
import { AgentTC } from './model';

/**
 * Extend Agent Type
 */
AgentTC.addFields({
	token: 'String' /** Never stored in mongo & is nullable, only ever returned by the loginAgent resolver. */,
});

AgentTC.removeField('password');

/**
 * Resolvers
 */

const Query = {
	agentById: AgentTC.mongooseResolvers.findById,
	agentByIds: AgentTC.mongooseResolvers.findByIds,
	agentOne: AgentTC.mongooseResolvers.findOne,
	agentMany: AgentTC.mongooseResolvers.findMany,
	agentCount: AgentTC.mongooseResolvers.count,
	...resolvers.Query,
};

const Mutation = {
	agentCreateOne: AgentTC.mongooseResolvers.createOne,
	agentCreateMany: AgentTC.mongooseResolvers.createMany,
	agentUpdateById: AgentTC.mongooseResolvers.updateById,
	agentUpdateOne: AgentTC.mongooseResolvers.updateOne,
	agentUpdateMany: AgentTC.mongooseResolvers.updateMany,
	agentRemoveById: AgentTC.mongooseResolvers.removeById,
	agentRemoveOne: AgentTC.mongooseResolvers.removeOne,
	agentRemoveMany: AgentTC.mongooseResolvers.removeMany,
	...resolvers.Mutation,
};

export default {
	Query,
	Mutation,
};
