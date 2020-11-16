export const streamWebhookPlugin = () => ({
	receive: (req, res, next) => {
		if (req.headers['target-agent'] === 'Stream Webhook Client') {
			const { body: event } = req;

			// eslint-disable-next-line no-console
			console.log('received stream webhook', event.type, event);

			res.send(200);
		}

		next();
	},
});
