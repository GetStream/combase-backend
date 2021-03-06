import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { nanoid } from 'nanoid';
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
		shortId: {
			type: String,
			unique: true,
			description: 'An ID generated client-side, used to cache optimistic responses properly in Apollo Client without the network.',
			default: () => nanoid(10),
		},
		tags: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Tag',
				description: 'Tag used to categorize a FAQ.',
			},
		],
		body: {
			type: String,
			trim: true,
			description: 'Serialized Markdown Body of the FAQ.',
			default: '',
		},
		status: {
			type: String,
			enum: ['draft', 'unpublished', 'published'],
			default: 'draft',
			description: 'The published status of the article, only published articles can be seen by anyone',
		},
		content: {
			type: JSON,
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
export const FaqTC = composeMongoose(FaqModel, {
	inputType: {
		onlyFields: ['content', 'tags', 'shortId', 'status'],
	},
	schemaComposer,
});
