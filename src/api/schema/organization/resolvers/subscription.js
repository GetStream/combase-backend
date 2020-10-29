import 'dotenv/config';
import { PubSub } from 'utils/pubsub';

export const organizationCreated = {
	type: 'InternalEntityMutationEvent',
	resolve: payload => payload,
	subscribe: () => PubSub.asyncIterator('INTERNAL_EVENT.ORGANIZATION_CREATED'),
};

export const organizationUpdated = {
	type: 'InternalEntityMutationEvent',
	resolve: payload => payload,
	subscribe: () => PubSub.asyncIterator('INTERNAL_EVENT.ORGANIZATION_UPDATED'),
};

export const organizationActivity = {
	type: 'JSON',
	args: { _id: 'String' },
	resolve: payload => payload,
	subscribe: (_, { _id }, { organization, stream }) => stream.subscriptions.feeds.asyncIterator(`organization:${_id || organization}`),
};
