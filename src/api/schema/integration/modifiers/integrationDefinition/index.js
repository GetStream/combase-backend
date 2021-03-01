import * as Query from './query';
import * as Mutation from './mutation';
import * as Subscription from './subscription';

export default {
	Mutation: Mutation.default || Mutation,
	Query: Query.default || Query,
	Subscription: Subscription.default || Subscription,
};
