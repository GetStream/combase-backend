import 'dotenv/config';
import { PubSub } from 'utils/pubsub';

export const agentUpdated = {
	type: 'InternalEvent',
	resolve: payload => payload,
	subscribe: () => PubSub.asyncIterator('INTERNAL_EVENT.AGENT_UPDATED'),
};

export const agentActivity = {
	type: 'JSON',
	args: { _id: 'String!' },
	resolve: payload => payload,
	subscribe: (_, { _id }, { stream }) => stream.subscriptions.feeds.asyncIterator(`agent:${_id}`),
};
