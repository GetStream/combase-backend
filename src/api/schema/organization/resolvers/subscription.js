export const organizationActivity = {
	type: 'StreamFlatFeedSubscription',
	args: { _id: 'String' },
	resolve: payload => payload,
	subscribe: (_, { _id }, { organization, stream }) => stream.subscriptions.feeds.asyncIterator(`organization:${_id || organization}`),
};
