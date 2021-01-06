export class CombaseWebhookInterchange {
	capn;

	constructor(capn) {
		this.capn = capn;

		this.listen();
	}

	publish = (trigger, payload) => this.capn.publish(trigger, payload);

	splitEvent = event => {
		const { triggers } = event.webhook;

		// eslint-disable-next-line no-param-reassign
		delete event.webhook.triggers;

		return triggers.map(trigger => [trigger, event]);
	};

	async listen() {
		for await (const event of this.capn.listen('capn:event')) {
			if (event.webhook?.triggers?.length) {
				const events = await this.splitEvent(event);

				for (const [trigger, payload] of events) {
					this.publish(trigger, payload);
				}
			}
		}
	}
}
