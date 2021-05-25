import * as extend from './extend';
import * as Query from './query';
import * as Mutation from './mutation';
import * as Subscription from './subscription';

export default {
	extend: extend.default || extend,
	Mutation: Mutation.default || Mutation,
	Query: Query.default || Query,
	Subscription: Subscription.default || Subscription,
};
