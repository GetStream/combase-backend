import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeMongoose } from 'graphql-compose-mongoose';

import { mongooseEventsPlugin as events } from 'utils/mongoose-events-plugin';

const WebhookSchema = new Schema(
	{
		organization: {
			type: Schema.Types.ObjectId,
			ref: 'Organization',
			required: true,
			description: 'A reference to the organization that the webhook is associated with.',
		},
		url: {
			type: String,
			trim: true,
			description: 'Absolute URL to send a payload to via an HTTP POST.',
		},
		name: {
			type: String,
			trim: true,
			required: true,
			description: 'Short name describing the webhook use-case.',
		},
		description: {
			type: String,
			trim: true,
			default: '',
			required: false,
			description: 'Simple description of what this webhook URL will handle.',
		},
		triggers: [
			{
				required: true,
				trim: true,
				type: String,
				description: 'The plugin triggered by this webhook event (plugin function to call).',
			},
		],
		auth: {
			type: {
				type: String,
				enum: ['querystring', 'header'],
				default: 'querystring',
			},
		},
		active: {
			type: Boolean,
			default: false,
			description: 'Status of the webhook.',
		},
	},
	{ collection: 'webhooks' }
);

WebhookSchema.plugin(timestamps);
WebhookSchema.plugin(events);

WebhookSchema.index({
	createdAt: 1,
	updatedAt: 1,
});

export const WebhookModel = mongoose.model('Webhook', WebhookSchema);
export const WebhookTC = composeMongoose(WebhookModel);
