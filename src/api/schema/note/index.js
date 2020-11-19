import resolvers from './resolvers';
import { NoteTC } from './model';

const Query = {
	noteById: NoteTC.mongooseResolvers.findById(),
	noteByIds: NoteTC.mongooseResolvers.findByIds(),
	noteOne: NoteTC.mongooseResolvers.findOne(),
	noteMany: NoteTC.mongooseResolvers.findMany(),
	noteCount: NoteTC.mongooseResolvers.count(),
	...resolvers.Query,
};

const Mutation = {
	noteCreateOne: NoteTC.mongooseResolvers.createOne(),
	noteCreateMany: NoteTC.mongooseResolvers.createMany(),
	noteUpdateById: NoteTC.mongooseResolvers.updateById(),
	noteUpdateOne: NoteTC.mongooseResolvers.updateOne(),
	noteUpdateMany: NoteTC.mongooseResolvers.updateMany(),
	noteRemoveById: NoteTC.mongooseResolvers.removeById(),
	noteRemoveOne: NoteTC.mongooseResolvers.removeOne(),
	noteRemoveMany: NoteTC.mongooseResolvers.removeMany(),
	...resolvers.Mutation,
};

export default {
	Query,
	Mutation,
};
