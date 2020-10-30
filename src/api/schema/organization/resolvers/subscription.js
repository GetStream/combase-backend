export const organizationActivity = {
	type: 'StreamFlatFeedSubscription',
	args: { _id: 'String' },
	resolve: payload => payload,
	subscribe: (_, { _id }, { organization, stream: { feeds, FeedsSubscription } }) =>
		new FeedsSubscription(feeds).asyncIterator(`organization:${_id || organization}`),
};
