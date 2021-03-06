import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeMongoose } from 'graphql-compose-mongoose';
import { composeAlgoliaIndex } from 'graphql-compose-algolia';

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
			default: 'chat',
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
		sentiment: {
			score: {
				type: String,
				enum: ['negative', 'neutral', 'positive'],
				default: 'neutral',
				description: 'The sentiment of a ticket – on a scale of 0 to 2.',
			},
			collected: {
				type: Boolean,
				default: false,
			},
		},
		subject: {
			type: String,
			description: 'The subject of the ticket, taken from the original message in the related conversation.',
		},
		status: {
			type: String,
			enum: ['open', 'closed', 'archived', 'unassigned', 'new'],
			default: 'new',
			description: 'The status of the ticket.',
			index: true,
		},
		meta: {
			type: Schema.Types.Mixed,
			description: 'Unstructured custom data associated with the ticket.',
		},
	},
	{ collection: 'tickets' }
);

TicketSchema.plugin(timestamps);

TicketSchema.index({
	createdAt: 1,
	updatedAt: 1,
});

const TicketModel = mongoose.model('Ticket', TicketSchema);

const composeAlgoliaOpts = {
	indexName: 'TICKETS',
	fields: ['organization', 'user', 'subject'],
	schemaComposer,
	appId: process.env.ALGOLIA_ID,
	apiKey: process.env.ALGOLIA_KEY,
};

const TicketTC = composeAlgoliaIndex(composeMongoose(TicketModel, { schemaComposer }), composeAlgoliaOpts);

export { TicketModel, TicketTC };
