import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeMongoose } from 'graphql-compose-mongoose';

import schemaComposer from 'api/schema/composer';

const InvitationSchema = new Schema(
	{
		organization: {
			type: Schema.Types.ObjectId,
			ref: 'Organization',
			description: 'A reference to the organization that the group is associated with.',
			required: true,
		},
		from: {
			type: Schema.Types.ObjectId,
			ref: 'Agent',
			description: 'The agent that sent this invitation.',
			required: true,
		},
		to: {
			type: String,
			trim: true,
			required: true,
			description: 'The email address of the invitee.',
		},
		access: {
			type: String,
			enum: ['super_admin', 'admin', 'moderator', 'guest'],
			default: 'guest',
			required: true,
			description: 'The access level of the invitee.',
		},
	},
	{ collection: 'invitations' }
);

InvitationSchema.plugin(timestamps);

InvitationSchema.index({
	createdAt: 1,
	updatedAt: 1,
});

InvitationSchema.index(
	{
		to: 1,
		organization: 1,
	},
	{ unique: true }
);

export const InvitationModel = mongoose.model('Invitation', InvitationSchema);
export const InvitationTC = composeMongoose(InvitationModel, { schemaComposer });
