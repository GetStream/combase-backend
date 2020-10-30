import { SchemaComposer } from 'graphql-compose';

const chatSchema = new SchemaComposer();

chatSchema.Subscription.addFields({
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
});

export default chatSchema.buildSchema();
