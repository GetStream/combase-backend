import mongoose, { Schema } from 'mongoose';
import bcrypt from 'mongoose-bcrypt';
import timestamps from 'mongoose-timestamp';
import { composeMongoose } from 'graphql-compose-mongoose';

import schemaComposer from 'api/schema/composer';

const AgentScheduleEntrySchema = new Schema({
	enabled: {
		type: Boolean,
		default: false,
		description: 'Whether this day is enabled on the schedule.',
	},
	day: [
		{
			type: String,
			enum: ['monday', 'tuesday', 'thursday', 'friday', 'saturday', 'sunday'],
			default: 'monday',
		},
	],
	time: [
		{
			start: {
				type: String,
				description: 'Start of availability for this day as a meridian-less 24h notation i.e. "17:00".',
				required: true,
			},
			end: {
				type: String,
				description: 'Start of availability for this day as a meridian-less 24h notation i.e. "17:00".',
				required: true,
			},
		},
	],
});

const AgentSchema = new Schema(
	{
		organization: {
			type: Schema.Types.ObjectId,
			ref: 'Organization',
			required: true,
			description: 'A reference to the organization the agent associated with.',
		},
		groups: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Group',
				required: false,
				description: 'A reference to the group the agent is assigned to.',
			},
		],
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
		role: {
			type: String,
			description: 'The defined role of the agent',
		},
		access: {
			type: String,
			enum: ['super_admin', 'admin', 'moderator', 'guest'],
			default: 'guest',
		},
		title: {
			type: String,
			trim: true,
			default: 'Support Agent',
			description: 'Title of the agent responding to a ticket.',
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
		schedule: [AgentScheduleEntrySchema],
		timezone: {
			type: String,
			default: 'Europe/London',
			description: 'The UTC timezone name. [defaults to GMT (Europe/London)]',
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

AgentSchema.index({
	createdAt: 1,
	updatedAt: 1,
});

export const AgentModel = mongoose.model('Agent', AgentSchema);

export const AgentTC = composeMongoose(AgentModel, { schemaComposer });
