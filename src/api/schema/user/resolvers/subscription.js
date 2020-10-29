import 'dotenv/config';
import { PubSub } from 'utils/pubsub';

export const userCreated = {
	type: 'InternalEntityMutationEvent',
	resolve: payload => payload,
	subscribe: () => PubSub.asyncIterator('INTERNAL_EVENT.USER_CREATED'),
};

export const userUpdated = {
	type: 'InternalEntityMutationEvent',
	resolve: payload => payload,
	subscribe: () => PubSub.asyncIterator('INTERNAL_EVENT.USER_UPDATED'),
};

export const userActivity = {
	type: 'JSON',
	args: { _id: 'String!' },
	resolve: payload => payload,
	subscribe: (_, { _id }, { stream }) => stream.subscriptions.feeds.asyncIterator(`user:${_id}`),
};
