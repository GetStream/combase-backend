import mongoose, { Schema } from 'mongoose';
import bcrypt from 'mongoose-bcrypt';
import timestamps from 'mongoose-timestamp';
import { composeMongoose } from 'graphql-compose-mongoose';

import { mongooseEventsPlugin as events } from 'utils/mongoose-events-plugin';

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
		hours: [
			{
				enabled: {
					type: Boolean,
					default: false,
					description: 'Whether this day is enabled on the schedule.',
				},
				day: {
					type: Number,
					enum: [1, 2, 3, 4, 5, 6, 7],
					description: 'The date this availability schedule relates to [week day as a non-zero-based numeral representation].',
				},
				start: {
					hour: {
						type: Number,
						min: 0,
						max: 23,
						default: 9,
						description: 'Start of availability for this day [hour as a numeral representation].',
					},
					minute: {
						type: Number,
						min: 0,
						max: 59,
						default: 0,
						description: 'Start of availability for this day [minute as a numeral representation].',
					},
				},
				end: {
					hour: {
						type: Number,
						min: 0,
						max: 23,
						default: 17,
						description: 'End of availability for this day [hour as a numeral representation].',
					},
					minute: {
						type: Number,
						min: 0,
						max: 59,
						default: 0,
						description: 'End of availability for this day [minute as a numeral representation].',
					},
				},
			},
		],
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
AgentSchema.plugin(events);

AgentSchema.index({
	createdAt: 1,
	updatedAt: 1,
});

export const AgentModel = mongoose.model('Agent', AgentSchema);
export const AgentTC = composeMongoose(AgentModel);
