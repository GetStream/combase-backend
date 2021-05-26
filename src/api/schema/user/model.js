import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeMongoose } from 'graphql-compose-mongoose';
import { composeAlgoliaIndex } from 'graphql-compose-algolia';

import schemaComposer from 'api/schema/composer';

const UserSchema = new Schema(
	{
		organization: {
			type: Schema.Types.ObjectId,
			ref: 'Organization',
			required: true,
			description: 'A reference to the organization that the user is associated with.',
		},
		name: {
			required: true,
			trim: true,
			type: String,
			description: 'The provided name of the user.',
		},
		email: {
			type: String,
			lowercase: true,
			trim: true,
			required: true,
			description: 'The provided email of the user.',
		},
		meta: {
			type: Schema.Types.Mixed,
			description: 'Unstructured custom data associated with the ticket.',
		},
		timezone: {
			type: Schema.Types.String,
			description: 'The timezone of the user. Updates (if changed) when a user creates a new ticket.',
		},
	},
	{ collection: 'users' }
);

UserSchema.plugin(timestamps);

UserSchema.index({
	createdAt: 1,
	updatedAt: 1,
});

UserSchema.index(
	{
		organization: 1,
		email: 1,
	},
	{ unique: true }
);

const UserModel = mongoose.model('User', UserSchema);

const composeAlgoliaOpts = {
	indexName: 'USERS',
	fields: ['name', 'email', 'organization'],
	schemaComposer,
	appId: process.env.ALGOLIA_ID,
	apiKey: process.env.ALGOLIA_KEY,
};

const UserTC = composeAlgoliaIndex(composeMongoose(UserModel, { schemaComposer }), composeAlgoliaOpts);

export { UserModel, UserTC };
