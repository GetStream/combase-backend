import mongoose, { Schema } from 'mongoose';
import bcrypt from 'mongoose-bcrypt';
import timestamps from 'mongoose-timestamp';
import { composeMongoose } from 'graphql-compose-mongoose';

import { events } from '@utils/mongoose-plugins';

const AgentSchema = new Schema(
	{
		organization: {
			type: Schema.Types.ObjectId,
			ref: 'Organization',
			required: true,
			description: 'A reference to the organization the agent associated with.',
		},
		team: {
			type: Schema.Types.ObjectId,
			ref: 'Team',
			required: false,
			description: 'A reference to the team the agent is assigned to.',
		},
		name: {
			full: {
				trim: true,
				type: String,
				required: true,
				description: 'Full name of the agent for internal purposes only.',
			},
			display: {
				trim: true,
				type: String,
				required: true,
				description: 'Publicly visible name of the agent.',
			},
		},
		title: {
			type: String,
			trim: true,
			default: 'Support Agent',
			description: 'Title of the agent responding to a chat.',
		},
		avatar: {
			type: String,
			trim: true,
			description: 'Absolute URL to the avatar of the agent.',
		},
		email: {
			type: String,
			lowercase: true,
			trim: true,
			required: true,
			description: 'Email address of the agent.',
		},
		password: {
			type: String,
			bcrypt: true,
			required: true,
			description: 'Password for the agent – bcrypted internally.',
		},
		active: {
			type: Boolean,
			default: true,
			description: 'Status of the agent – an agent is never removed from history in order to preserve the timeline.',
		},
	},
	{ collection: 'agents' }
);

AgentSchema.plugin(bcrypt);
AgentSchema.plugin(timestamps);
AgentSchema.plugin(events);

AgentSchema.index({
	createdAt: 1,
	updatedAt: 1,
});

export const AgentModel = mongoose.model('Agent', AgentSchema);
export const AgentTC = composeMongoose(AgentModel);
