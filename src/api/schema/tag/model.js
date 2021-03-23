import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeMongoose } from 'graphql-compose-mongoose';

import schemaComposer from 'api/schema/composer';

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
			description: 'A short description of the tag.',
		},
	},
	{ collection: 'tags' }
);

TagSchema.plugin(timestamps);

TagSchema.index({
	createdAt: 1,
	updatedAt: 1,
});

TagSchema.index(
	{
		name: 1,
		organization: 1,
	},
	{
		unique: true,
	}
);

export const TagModel = mongoose.model('Tag', TagSchema);
export const TagTC = composeMongoose(TagModel, { schemaComposer });
