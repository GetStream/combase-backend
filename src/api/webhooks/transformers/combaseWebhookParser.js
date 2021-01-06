import { Models } from 'api/schema';

import { logger } from 'utils/logger';

export const combaseWebhookParser = async payload => {
	const { query } = payload;

	try {
		if (!query?.webhook) {
			throw new Error('Combase Webhook Parser: No webhook ID.');
		}

		const webhook = await Models.Webhook.findById(query.webhook);

		const organization = await Models.Organization.findOne(
			{ _id: webhook.organization },
			{
				name: true,
				stream: true,
			}
		);

		return {
			...payload,
			organization: {
				_id: organization._id.toString(),
				name: organization.name,
				stream: organization.stream._doc,
			},
			webhook,
		};
	} catch (error) {
		logger.error(error);

		return payload;
	}
};
