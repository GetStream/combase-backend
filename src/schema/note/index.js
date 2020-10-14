import mongoose from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { schemaComposer } from 'graphql-compose';

import NoteSchema from './model';

const Model = mongoose.model('Note', NoteSchema);

const customizationOptions = {};
const NoteTC = composeMongoose(Model, customizationOptions);

schemaComposer.Query.addFields({
	noteById: NoteTC.mongooseResolvers.findById,
	noteByIds: NoteTC.mongooseResolvers.findByIds,
	noteOne: NoteTC.mongooseResolvers.findOne,
	noteMany: NoteTC.mongooseResolvers.findMany,
	noteCount: NoteTC.mongooseResolvers.count,
});

schemaComposer.Mutation.addFields({
	noteCreateOne: NoteTC.mongooseResolvers.createOne,
	noteCreateMany: NoteTC.mongooseResolvers.createMany,
	noteUpdateById: NoteTC.mongooseResolvers.updateById,
	noteUpdateOne: NoteTC.mongooseResolvers.updateOne,
	noteUpdateMany: NoteTC.mongooseResolvers.updateMany,
	noteRemoveById: NoteTC.mongooseResolvers.removeById,
	noteRemoveOne: NoteTC.mongooseResolvers.removeOne,
	noteRemoveMany: NoteTC.mongooseResolvers.removeMany,
});

export default schemaComposer.buildSchema();
