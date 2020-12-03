import { Models } from 'api/schema';

export const combaseWebhookParser = async payload => {
	try {
		const webhook = await Models.Webhook.findById(payload.webhook);

		return {
			...payload,
			webhook,
		};
	} catch (error) {
		return payload;
	}
};
