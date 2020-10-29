export const userActivity = {
	type: 'StreamFlatFeedSubscription',
	args: { _id: 'String!' },
	resolve: payload => payload,
	subscribe: (_, { _id }, { stream }) => stream.subscriptions.feeds.asyncIterator(`user:${_id}`),
};
