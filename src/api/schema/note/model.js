import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeMongoose } from 'graphql-compose-mongoose';

import schemaComposer from 'api/schema/composer';

const NoteSchema = new Schema(
	{
		ticket: {
			type: Schema.Types.ObjectId,
			ref: 'Ticket',
			required: true,
			description: 'A reference to the ticket that the note is associated with.',
		},
		agent: {
			type: Schema.Types.ObjectId,
			ref: 'Agent',
			required: true,
			description: 'A reference to the agent that the note is associated with.',
		},
		data: {
			type: String,
			trim: true,
			required: true,
			description: 'A string representation of the note associated with a ticket – this is serialized and displayed by the frontend.',
		},
	},
	{ collection: 'notes' }
);

NoteSchema.plugin(timestamps);

NoteSchema.index({
	createdAt: 1,
	updatedAt: 1,
});

export const NoteModel = mongoose.model('Note', NoteSchema);
export const NoteTC = composeMongoose(NoteModel, { schemaComposer });
