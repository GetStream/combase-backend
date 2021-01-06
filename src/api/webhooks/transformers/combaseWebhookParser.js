import { Models } from 'api/schema';
import jwt from 'jsonwebtoken';

import { logger } from 'utils/logger';

export const combaseWebhookParser = async payload => {
	const { query } = payload;

	try {
		if (!query?.token) {
			throw new Error('Combase Webhook Parser: No Token in req.query');
		}

		const tokenPayload = jwt.verify(query?.token, process.env.AUTH_SECRET);

		if (!tokenPayload?.webhook || !tokenPayload?.organization) {
			throw new Error(`Combase Webhook Parser: Malformed Token Payload \n ${JSON.stringify(tokenPayload)}`);
		}

		const webhook = await Models.Webhook.findById(tokenPayload.webhook);

		const organization = await Models.Organization.findOne(
			{ _id: tokenPayload.organization },
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
