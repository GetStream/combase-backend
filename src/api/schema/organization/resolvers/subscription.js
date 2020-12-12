export const organizationActivity = {
	type: 'StreamRealtimeFeed',
	args: { _id: 'String' },
	resolve: payload => payload,
	subscribe: (source, { _id }, { stream }) =>
		new stream.FeedSubscription(stream.feeds).asyncIterator(`organization:${_id || source?._id?.toString()}`),
};
