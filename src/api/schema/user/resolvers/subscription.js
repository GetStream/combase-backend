export const userActivity = {
	type: 'StreamFlatFeedSubscription',
	args: { _id: 'String!' },
	resolve: payload => payload,
	subscribe: (_, { _id }, { stream: { feeds, FeedsSubscription } }) => new FeedsSubscription(feeds).asyncIterator(`user:${_id}`),
};
