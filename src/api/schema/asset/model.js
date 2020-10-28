import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeMongoose } from 'graphql-compose-mongoose';

import { mongooseEventsPlugin as events } from 'utils/mongoose-events-plugin';

const AssetSchema = new Schema(
	{
		organization: {
			type: Schema.Types.ObjectId,
			ref: 'Organization',
			required: true,
			description: 'Organization the asset is associated with.',
		},
		url: {
			type: String,
			trim: true,
			unqiue: true,
			required: true,
			description: 'Absolute URL to the uploaded asset.',
		},
	},
	{ collection: 'assets' }
);

AssetSchema.plugin(timestamps);
AssetSchema.plugin(events);

AssetSchema.index({
	createdAt: 1,
	updatedAt: 1,
});

export const AssetModel = mongoose.model('Asset', AssetSchema);
export const AssetTC = composeMongoose(AssetModel);
