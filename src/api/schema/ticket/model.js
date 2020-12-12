import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeMongoose } from 'graphql-compose-mongoose';

import schemaComposer from 'api/schema/composer';
import { mongooseEventsPlugin as events } from 'utils/mongoose-events-plugin';

const TicketSchema = new Schema(
	{
		organization: {
			type: Schema.Types.ObjectId,
			ref: 'Organization',
			required: true,
			description: 'A reference to the organization the ticket is associated with.',
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: false,
			description: 'A reference to the user who created a ticket.',
		},
		agents: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Agent',
				required: false,
				description: 'A reference to the agent assigned to a ticket.',
			},
		],
		group: {
			type: Schema.Types.ObjectId,
			ref: 'Group',
			required: false,
			description: 'A reference to the group the a ticket is assigned to.',
		},
		tags: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Tag',
				required: false,
				description: 'Tag for categorizing a ticket.',
			},
		],
		labels: [
			{
				type: String,
				enum: ['priority', 'starred'],
				description: 'Label for categorizing a ticket.',
			},
		],
		notes: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Note',
				required: false,
				description: 'Internal notes for a ticket – visible to organization agents only.',
			},
		],
		sentiment: {
			score: {
				type: String,
				enum: ['negative', 'nuetral', 'positive'],
				defualt: 'neutral',
				description: 'The sentiment of a ticket – on a scale of 0 to 2.',
			},
			collected: {
				type: Boolean,
				default: false,
			},
		},
		type: {
			type: String,
			enum: ['email', 'chat', 'unassigned'],
			default: 'unassigned',
			description: 'The type of ticket – chat or email [defaults to unassigned].',
			index: true,
		},
		status: {
			type: String,
			enum: ['open', 'closed', 'archived', 'unassigned'],
			default: 'open',
			description: 'The status of the ticket.',
			index: true,
		},
	},
	{ collection: 'tickets' }
);

TicketSchema.plugin(timestamps);
TicketSchema.plugin(events);

TicketSchema.index({
	createdAt: 1,
	updatedAt: 1,
});

export const TicketModel = mongoose.model('Ticket', TicketSchema);
export const TicketTC = composeMongoose(TicketModel, { schemaComposer });
