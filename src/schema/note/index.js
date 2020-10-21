import mongoose from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';

import Schema from './model';

const Model = mongoose.model('Note', Schema);

const customizationOptions = {};
const NoteTC = composeMongoose(Model, customizationOptions);

const Query = {
	noteById: NoteTC.mongooseResolvers.findById,
	noteByIds: NoteTC.mongooseResolvers.findByIds,
	noteOne: NoteTC.mongooseResolvers.findOne,
	noteMany: NoteTC.mongooseResolvers.findMany,
	noteCount: NoteTC.mongooseResolvers.count,
};

const Mutation = {
	noteCreateOne: NoteTC.mongooseResolvers.createOne,
	noteCreateMany: NoteTC.mongooseResolvers.createMany,
	noteUpdateById: NoteTC.mongooseResolvers.updateById,
	noteUpdateOne: NoteTC.mongooseResolvers.updateOne,
	noteUpdateMany: NoteTC.mongooseResolvers.updateMany,
	noteRemoveById: NoteTC.mongooseResolvers.removeById,
	noteRemoveOne: NoteTC.mongooseResolvers.removeOne,
	noteRemoveMany: NoteTC.mongooseResolvers.removeMany,
};

export const NoteModel = Model;

export default {
	Query,
	Mutation,
};
