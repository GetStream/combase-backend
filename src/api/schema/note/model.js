import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeMongoose } from 'graphql-compose-mongoose';

import { mongooseEventsPlugin as events } from 'utils/mongoose-events-plugin';

const NoteSchema = new Schema(
	{
		chat: {
			type: Schema.Types.ObjectId,
			ref: 'Chat',
			required: true,
			description: 'A reference to the chat that the note is associated with.',
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
			description: 'A string representation of the note associated with a chat – this is serialized and displayed by the frontend.',
		},
	},
	{ collection: 'notes' }
);

NoteSchema.plugin(timestamps);
NoteSchema.plugin(events);

NoteSchema.index({
	createdAt: 1,
	updatedAt: 1,
});

export const NoteModel = mongoose.model('Note', NoteSchema);
export const NoteTC = composeMongoose(NoteModel);
