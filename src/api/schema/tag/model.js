import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeMongoose } from 'graphql-compose-mongoose';

import schemaComposer from 'api/schema/composer';
import { mongooseEventsPlugin as events } from 'utils/mongoose-events-plugin';

const TagSchema = new Schema(
	{
		organization: {
			type: Schema.Types.ObjectId,
			ref: 'Organization',
			required: true,
			description: 'A reference to the organization a tag is associated with.',
		},
		name: {
			type: String,
			trim: true,
			required: true,
			description: 'Name of the tag.',
		},
		description: {
			type: String,
			trim: true,
			required: true,
			description: 'A short description of the tag.',
		},
	},
	{ collection: 'tags' }
);

TagSchema.plugin(timestamps);
TagSchema.plugin(events);

TagSchema.index({
	createdAt: 1,
	updatedAt: 1,
});

export const TagModel = mongoose.model('Tag', TagSchema);
export const TagTC = composeMongoose(TagModel, { schemaComposer });
