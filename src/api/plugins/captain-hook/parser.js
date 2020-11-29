import { Models } from 'api/schema';

// Mutates the payload and returns truthy so that the next plugin can run
export default () => ({
	receive: async payload => {
		const webhook = await Models.Webhook.findById({
			_id: payload.webhook,
		});

		// eslint-disable-next-line no-param-reassign
		payload.webhook = webhook;

		// We could return webhook, so that if the webhook doesn't exist in mongo, the chain stops. Currently forced true to test.
		return true;
	},
	test: () => true,
});
