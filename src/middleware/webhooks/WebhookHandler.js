import { WebhookModel } from 'schema/webhook/model';

import InboundWebhookHandler from './InboundWebhookHandler';

class WebhookHandler {
	// eslint-disable-next-line no-unused-vars
	static getHandler = async ({ key: id }, body) => {
		// go to mongo, pass the key (webhook id) to find the webhook
		const webhook = await WebhookModel.findById(id);

		switch (webhook.type) {
			case 'inbound':
				return new InboundWebhookHandler(webhook);
			/*
			 * case 'outbound':
			 * 	return new OutboundWebhookHandler(webhook);
			 */
			default:
				throw new Error('Unrecognized or undefined webhook type.');
		}
	};
}

export default WebhookHandler;
