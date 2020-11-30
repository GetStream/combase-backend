import { Models } from 'api/schema';

/**
 * We put this plugin first in the chain and set the test method to always return true,
 * this means this plugin will catch every event, attempt to find the webhook id in the payload,
 * and call mongo to get the full list of triggers related to this event within the users organization.
 */
export class CombaseWebhookParser {
	findWebhook = payload =>
		Models.Webhook.findById({
			_id: payload.webhook,
		});

	receive = async payload => {
		const webhook = await this.findWebhook(payload);

		// eslint-disable-next-line no-param-reassign
		payload.webhook = webhook;

		return true; // TEMP
		// return webhook; // this will stop the chain of captain-hook plugins if the webhook returns falsey from mongo.
	};

	test = () => true; // always returns true.
}
