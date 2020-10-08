import { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const NoteSchema = new Schema(
  {
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    agent: {
      type: Schema.Types.ObjectId,
      ref: "Agent",
      required: true,
    },
    data: {
      type: String,
    },
  },
  { collection: "notes" }
);

NoteSchema.plugin(timestamps);

NoteSchema.index({
  createdAt: 1,
  updatedAt: 1,
});

export default NoteSchema;
