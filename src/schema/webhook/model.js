import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeMongoose } from 'graphql-compose-mongoose';

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
			unqiue: true,
			required: true,
			description: 'Absolute URL to send a payload to via an HTTP post.',
		},
		description: {
			type: String,
			trim: true,
			unqiue: true,
			required: true,
			description: 'Simple description of what this webhook URL will handle.',
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

WebhookSchema.index({
	createdAt: 1,
	updatedAt: 1,
});

export const WebhookModel = mongoose.model('Webhook', WebhookSchema);
export const WebhookTC = composeMongoose(WebhookModel);
