import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeMongoose } from 'graphql-compose-mongoose';

import schemaComposer from 'api/schema/composer';

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
		source: {
			type: Schema.Types.String,
			enum: ['email', 'chat'],
			required: true,
			description: 'The original source of a Ticket.',
		},
		tags: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Tag',
				required: false,
				description: 'Tag for categorizing a ticket.',
			},
		],
		priority: {
			type: Schema.Types.Number,
			min: 0,
			max: 2,
			default: 0,
			description: 'The priority level between 0 and 2 for a ticket.',
		},
		starred: {
			type: Boolean,
			description: 'Flag indicating whether a ticket has been starred.',
		},
		labels: [
			// TODO: remove
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
		status: {
			type: String,
			enum: ['open', 'closed', 'archived', 'unassigned', 'new'],
			default: 'new',
			description: 'The status of the ticket.',
			index: true,
		},
	},
	{ collection: 'tickets' }
);

TicketSchema.plugin(timestamps);

TicketSchema.index({
	createdAt: 1,
	updatedAt: 1,
});

export const TicketModel = mongoose.model('Ticket', TicketSchema);
export const TicketTC = composeMongoose(TicketModel, { schemaComposer });
