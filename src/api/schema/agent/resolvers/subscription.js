export const agentActivity = {
	type: 'StreamFlatFeedSubscription',
	args: { _id: 'String!' },
	resolve: payload => payload,
	subscribe: (_, { _id }, { stream }) => stream.subscriptions.feeds.asyncIterator(`agent:${_id}`),
};
