import mongoose from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { schemaComposer } from 'graphql-compose';

import resolvers from './resolvers';
import { typeDefs } from './typeDefs';
import Schema from './model';

const Model = mongoose.model('Agent', Schema);

const customizationOptions = {};
const AgentTC = composeMongoose(Model, customizationOptions);

AgentTC.addFields({
	token: 'String' /** Never stored in mongo & is nullable, only ever returned by the loginAgent resolver. */,
});

schemaComposer.Query.addFields({
	agentById: AgentTC.mongooseResolvers.findById,
	agentByIds: AgentTC.mongooseResolvers.findByIds,
	agentOne: AgentTC.mongooseResolvers.findOne,
	agentMany: AgentTC.mongooseResolvers.findMany,
	agentCount: AgentTC.mongooseResolvers.count,
});

schemaComposer.Mutation.addFields({
	agentCreateOne: AgentTC.mongooseResolvers.createOne,
	agentCreateMany: AgentTC.mongooseResolvers.createMany,
	agentUpdateById: AgentTC.mongooseResolvers.updateById,
	agentUpdateOne: AgentTC.mongooseResolvers.updateOne,
	agentUpdateMany: AgentTC.mongooseResolvers.updateMany,
	agentRemoveById: AgentTC.mongooseResolvers.removeById,
	agentRemoveOne: AgentTC.mongooseResolvers.removeOne,
	agentRemoveMany: AgentTC.mongooseResolvers.removeMany,
});

if (typeDefs) schemaComposer.addTypeDefs(typeDefs);

schemaComposer.addResolveMethods(resolvers);

export const AgentModel = Model;
export const AgentSchema = schemaComposer.buildSchema();
