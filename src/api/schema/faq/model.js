import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeMongoose } from 'graphql-compose-mongoose';

import schemaComposer from 'api/schema/composer';

const defaultContent = [
	{
		children: [
			{
				children: [{ text: '' }],
				type: 'h1',
			},
		],
	},
];

const FaqSchema = new Schema(
	{
		organization: {
			type: Schema.Types.ObjectId,
			ref: 'Organization',
			required: true,
			description: 'A reference to the organization to the FAQ is associated with.',
		},
		tags: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Tag',
				description: 'Tag used to categorize a FAQ.',
			},
		],
		title: {
			type: String,
			trim: true,
			description: 'Title of the FAQ.',
		},
		body: {
			type: String,
			trim: true,
			description: 'Body of the FAQ.',
		},
		content: {
			type: JSON,
			required: true,
			default: defaultContent,
			description:
				'Original Slate JSON from the editor: used as a backup to re-serialize content if necessary, or on the fly. Title & Body should be serialized when the document is updated',
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'Agent',
			required: true,
			description: 'A reference to the agent that created this FAQ article',
		},
	},
	{ collection: 'faqs' }
);

FaqSchema.plugin(timestamps);

FaqSchema.index({
	createdAt: 1,
	updatedAt: 1,
});

export const FaqModel = mongoose.model('Faq', FaqSchema);
export const FaqTC = composeMongoose(FaqModel, { schemaComposer });
