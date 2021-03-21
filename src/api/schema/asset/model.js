import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeMongoose } from 'graphql-compose-mongoose';

import schemaComposer from 'api/schema/composer';

const AssetSchema = new Schema(
	{
		organization: {
			type: Schema.Types.ObjectId,
			ref: 'Organization',
			required: true,
			description: 'Organization the asset is associated with.',
		},
		source: {
			type: String,
			enum: ['s3'],
			default: 's3',
			required: true,
		},
		type: {
			type: String,
			enum: ['image'],
			required: true,
		},
		contentType: {
			type: String,
			required: true,
		},
		ref: {
			type: String,
			trim: true,
			description: 'Path to the asset on the source platform.',
		},
	},
	{ collection: 'assets' }
);

AssetSchema.plugin(timestamps);

AssetSchema.index({
	createdAt: 1,
	updatedAt: 1,
});

const AssetModel = mongoose.model('Asset', AssetSchema);
const AssetTC = composeMongoose(AssetModel, {
	schemaComposer,
});

const AssetInterface = schemaComposer.createInterfaceTC(`
	interface AssetInterface {
		_id: MongoID!
		source: EnumAssetSource!
		ref: String
		type: EnumAssetType!
		organization: MongoID!
	}
`);

AssetTC.addInterface(AssetInterface);

export { AssetModel, AssetTC };
