import * as Query from './query';
import * as Mutation from './mutation';
import * as extend from './extend';

export default {
	Query: Query.default || Query,
	Mutation: Mutation.default || Mutation,
	extend: extend.default || extend,
};
