import { connect as streamFeedsClient } from 'getstream';
import { PubSubEngine } from 'graphql-subscriptions';

export class FeedsSubscriber extends PubSubEngine {
	currentSubscriptionId = 0;

	subscriptions = {};

	subRefMap = {};

	constructor(keyOrClient, secret, appId) {
		super();

		if (!appId && typeof keyOrClient === 'string') {
			throw new Error('Missing app id, which is needed to subscribe, use new FeedsSubscriber(key, secret, appId);');
		}

		this.client = typeof keyOrClient === 'string' ? streamFeedsClient(keyOrClient, secret, appId) : keyOrClient;
	}

	publish = () => Promise.resolve();

	subscribe(triggerName, onMessage) {
		const feedParts = triggerName.split(':');

		const id = this.currentSubscriptionId++;

		const feed = this.client.feed(...feedParts);

		this.subscriptions[id] = feed.subscribe(onMessage);

		return Promise.resolve(id);
	}

	unsubscribe(id) {
		const subscription = this.subscriptions[id];

		delete this.subscriptions[id];

		subscription.unsubscribe();
	}
}
