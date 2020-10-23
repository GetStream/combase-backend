import { logger } from 'utils/logger';

import WebhookHandler from './WebhookHandler';
// "https://api.combase.app/webhooks?key=webhookID"

export default ({ query }) => {
	try {
		const handler = WebhookHandler.getHandler(query);

		return handler;
	} catch (error) {
		logger.error(error.message);
	}

	return undefined;
};
