import { rabbitmq } from 'utils';

export default class PubSub {
	constructor(event, payload) {
		return (async () => {
			this.client = await rabbitmq();

			this.event = event;
			this.payload = payload;

			this.payload = this.publisher = this.client;
			this.subscriber = this.client;

			this.exchange = 'event';

			return this;
		})();
	}

	static async publish() {
		const publication = await this.client.publish(this.exchange, this.payload);

		publication
			.on('error', error => {
				throw new Error(error);
			})
			.on('success', message => {
				return message;
			});
	}

	static async subscribe() {
		const subscription = await this.client.subscribe(this.exchange, {
			prefetch: 10,
			retry: false,
		});

		subscription
			.on('message', (message, content, ackOrNack) => {
				ackOrNack({ strategy: 'ack' });

				return {
					message,
					content,
				};
			})
			.on('error', error => {
				throw new Error(error);
			});
	}
}
