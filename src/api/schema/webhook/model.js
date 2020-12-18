import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeMongoose } from 'graphql-compose-mongoose';

import schemaComposer from 'api/schema/composer';
import { mongooseEventsPlugin as events } from 'utils/mongoose-events-plugin';

const WebhookSchema = new Schema(
	{
		organization: {
			type: Schema.Types.ObjectId,
			ref: 'Organization',
			required: true,
			index: true,
			description: 'A reference to the organization that the webhook is associated with.',
		},
		name: {
			type: String,
			trim: true,
			required: true,
			description: 'Name of the the webhook.',
		},
		description: {
			type: String,
			trim: true,
			default: '',
			required: false,
			description: 'Description of what this webhook receiver will handle.',
		},
		provider: {
			type: String,
			trim: true,
			required: true,
			description: 'URL of the provider for which the webhook is intended.',
		},
		triggers: [
			{
				type: String,
				required: true,
				trim: true,
				description: 'The plugin triggered by this webhook event (plugin and event to call - provider:plugin/event).',
			},
		],
		active: {
			type: Boolean,
			default: false,
			index: true,
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
export const WebhookTC = composeMongoose(WebhookModel, { schemaComposer });
