import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeMongoose } from 'graphql-compose-mongoose';

import schemaComposer from 'api/schema/composer';
import { OrganizationTC } from 'api/schema/organization/model';

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
const UserTC = composeMongoose(UserModel, { schemaComposer });

UserTC.addRelation('parentOrganization', {
	prepareArgs: {
		_id: ({ organization }) => organization.toString(),
	},
	projection: { organization: true },
	resolver: OrganizationTC.mongooseResolvers.findById(),
});

export { UserModel, UserTC };
