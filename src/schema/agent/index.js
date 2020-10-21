import mongoose from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';

import Schema from './model';

const Model = mongoose.model('Agent', Schema);

const customizationOptions = {};
const AgentTC = composeMongoose(Model, customizationOptions);

AgentTC.addFields({
	token: 'String' /** Never stored in mongo & is nullable, only ever returned by the loginAgent resolver. */,
});

const Query = {
	agentById: AgentTC.mongooseResolvers.findById,
	agentByIds: AgentTC.mongooseResolvers.findByIds,
	agentOne: AgentTC.mongooseResolvers.findOne,
	agentMany: AgentTC.mongooseResolvers.findMany,
	agentCount: AgentTC.mongooseResolvers.count,
	// ...resolvers.Query,
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
	// ...resolvers.Mutation,
};

// if (typeDefs) schemaComposer.addTypeDefs(typeDefs);

// schemaComposer.addResolveMethods(resolvers);

export const AgentModel = Model;

export default {
	Query,
	Mutation,
};
