import * as Query from './query';
import * as Mutation from './mutation';
import * as extend from './extend';

export default {
	extend: extend.default || extend,
	Query: Query.default || Query,
	Mutation: Mutation.default || Mutation,
};
