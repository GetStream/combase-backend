export default class StreamWebhookPlugin {
	handleChannelCreated = event => {
		// eslint-disable-next-line no-console
		console.log('channel created', event);
	};

	handleChannelUpdated = event => {
		// eslint-disable-next-line no-console
		console.log('channel updated', event);
	};

	receive = (req, res, next) => {
		if (req.headers['target-agent'] === 'Stream Webhook Client') {
			const { body: event } = req;

			// eslint-disable-next-line no-console
			console.log('received stream webhook', event.type, event);

			switch (event.type) {
				case 'channel.updated': {
					this.handleChannelUpdated(event);
					res.sendStatus(200);

					break;
				}

				default:
					return next();
			}
		}

		next();
	};
}
