const Subscription = {
	channelEvents: {
		type: 'JSON',
		args: {
			cid: 'String',
			trigger: 'String',
		},
		resolve: payload => payload,
		subscribe: (_, { cid, trigger }, { stream: { chat, ChatSubscription }, user }) =>
			new ChatSubscription(chat, user).asyncIterator(`${cid}${trigger ? `:${trigger}` : ''}`),
	},
	chatEvents: {
		type: 'JSON',
		args: {},
		resolve: payload => payload,
		subscribe: (_, __, { stream: { chat, ChatSubscription }, user }) => new ChatSubscription(chat, user).asyncIterator('*'),
	},
};

export default {
	Subscription,
};
