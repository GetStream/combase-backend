import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeMongoose } from 'graphql-compose-mongoose';

const GroupSchema = new Schema(
	{
		organization: {
			type: Schema.Types.ObjectId,
			ref: 'Organization',
			required: true,
			description: 'A reference to the organization that the group is associated with.',
		},
		name: {
			required: true,
			trim: true,
			type: String,
		},
		agents: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Agent',
				required: true,
			},
		],
	},
	{ collection: 'groups' }
);

GroupSchema.plugin(timestamps);

GroupSchema.index({
	createdAt: 1,
	updatedAt: 1,
});

export const GroupModel = mongoose.model('Group', GroupSchema);
export const GroupTC = composeMongoose(GroupModel);