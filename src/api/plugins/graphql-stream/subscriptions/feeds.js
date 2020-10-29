import { connect as streamFeedsClient } from 'getstream';
import { PubSubEngine } from 'graphql-subscriptions';

export class FeedsSubscription extends PubSubEngine {
	currentSubscriptionId = 0;

	subscriptions = {};

	subRefMap = {};

	constructor(keyOrClient, token, appId) {
		super();

		if (!appId && typeof keyOrClient === 'string') {
			throw new Error(
				'Missing app id, which is needed in order to subscribe. Initialize the client using: new FeedsSubscriber(key, token, appId) OR pass in a Stream Feeds Client that includes the appId.'
			);
		}

		this.client = typeof keyOrClient === 'string' ? streamFeedsClient(keyOrClient, token, appId) : keyOrClient;
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
