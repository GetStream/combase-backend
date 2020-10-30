export const agentActivity = {
	type: 'StreamFeed',
	args: { _id: 'String!' },
	resolve: payload => payload,
	subscribe: (_, { _id }, { stream }) => new stream.FeedsSubscription(stream.feeds).asyncIterator(`agent:${_id}`),
};
