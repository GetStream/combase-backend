import { SchemaComposer } from 'graphql-compose';

const chatSchema = new SchemaComposer();

chatSchema.addTypeDefs(`
	type ChatEvent {
		type: String!
	}
`);

chatSchema.Subscription.addFields({
	channelEvents: {
		type: 'ChatEvent',
		args: {
			cid: 'String',
			trigger: 'String',
		},
		resolve: payload => payload,
		subscribe: (_, { cid, trigger }, { stream: { chat, ChatSubscription }, agent }) =>
			new ChatSubscription(chat, agent).asyncIterator(`${cid}${trigger ? `:${trigger}` : ''}`),
	},
	chatEvents: {
		type: 'ChatEvent',
		args: {},
		resolve: payload => payload,
		subscribe: (_, __, { stream: { chat, ChatSubscription }, agent }) => new ChatSubscription(chat, agent).asyncIterator('*'),
	},
});

export default chatSchema.buildSchema();
