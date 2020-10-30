export const agentActivity = {
	type: 'StreamFlatFeedSubscription',
	args: { _id: 'String!' },
	resolve: payload => payload,
	subscribe: (_, { _id }, { stream: { feeds, FeedsSubscription } }) => new FeedsSubscription(feeds).asyncIterator(`agent:${_id}`),
};
