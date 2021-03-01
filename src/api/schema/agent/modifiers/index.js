import * as extend from './extend';
import * as Query from './query';
import * as Mutation from './mutation';
import * as Subscription from './subscription';

export default {
	extend: extend.default || extend,
	Query: Query.default || Query,
	Mutation: Mutation.default || Mutation,
	Subscription: Subscription.default || Subscription,
};
