export const streamWebhookPlugin = () => ({
	receive: (req, _, next) => {
		if (req.headers['target-agent'] === 'Stream Webhook Client') {
			const { body: event } = req;

			// eslint-disable-next-line no-console
			console.log('received stream webhook', event.type, event);
		}

		next();
	},
});
