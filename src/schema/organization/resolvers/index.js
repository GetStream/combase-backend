import * as Organization from './Organization';
import * as Query from './query';
import * as Mutation from './mutation';

export default {
	Organization: Organization.default || Organization,
	Query: Query.default || Query,
	Mutation: Mutation.default || Mutation,
};
