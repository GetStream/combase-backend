import { PubSubEngine } from 'graphql-subscriptions';

export class ChatSubscription extends PubSubEngine {
	currentSubscriptionId = 0;

	subscriptions = {};

	subRefMap = {};

	constructor(client, user) {
		super();

		if (!client) {
			throw new Error('Missing StreamChat client: new ChatSubscriber(client)');
		}

		if (!user) {
			throw new Error('Must provide a user ID.');
		}

		this.client = client;
		this.client.setUser({ id: user });
	}

	publish = () => Promise.resolve();

	async subscribe(trigger, onMessage) {
		const id = this.currentSubscriptionId++;

		if (trigger === '*') {
			this.client.on(onMessage);
			this.subscriptions[id] = [null, onMessage];
		} else {
			const [type, _id, event] = trigger.split(':');

			const channel = this.client.channel(type, _id);

			await channel.watch();

			if (event) {
				channel.on(event, onMessage);
			} else {
				channel.on(onMessage);
			}

			this.subscriptions[id] = [channel, onMessage];
		}

		return Promise.resolve(id);
	}

	unsubscribe(id) {
		const [channel, handler] = this.subscriptions[id];

		delete this.subscriptions[id];

		if (!channel) {
			this.client.off(handler);
		} else {
			channel.off(handler);
		}
	}
}
