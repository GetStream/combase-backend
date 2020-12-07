import { Models } from 'api/schema';

export const combaseWebhookParser = async payload => {
	try {
		const webhook = await Models.Webhook.findById(payload.webhook);

		const organization = await Models.Organization.findOne(
			{ _id: payload.organization },
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
		return payload;
	}
};
