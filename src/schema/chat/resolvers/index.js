import * as Query from './query';
import * as Mutation from './mutation';

export default {
	Query: Query.default || Query,
	Mutation: Mutation.default || Mutation,
};
