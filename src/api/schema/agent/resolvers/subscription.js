import 'dotenv/config';
import { FeedsSubscriber } from 'utils/stream-subscriptions';
import { PubSub } from 'utils/pubsub';

export const agentUpdated = {
	type: 'InternalEvent',
	resolve: payload => payload,
	subscribe: () => PubSub.asyncIterator('INTERNAL_EVENT.AGENT_UPDATED'),
};

export const agentEvent = {
	type: 'JSON',
	args: { _id: 'String!' },
	resolve: payload => payload,
	subscribe: (_, { _id }, { stream }) => {
		const sub = new FeedsSubscriber(stream.feeds);

		return sub.asyncIterator(`agent:${_id}`);
	},
};
