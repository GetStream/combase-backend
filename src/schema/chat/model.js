import { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const ChatSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    agents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Agent",
        required: true,
      },
    ],
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: false,
    },
    tags: {
      type: String,
      enum: ["none", "priority", "starred"],
      default: "none",
    },
    notes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Note",
        required: false,
      },
    ],
    sentiment: {
      type: String,
      enum: ["negative", "nuetral", "positive"],
      defualt: "neutral",
    },
    status: {
      type: String,
      enum: ["open", "closed", "archived"],
      default: "open",
    },
  },
  { collection: "chats" }
);

ChatSchema.plugin(timestamps);

ChatSchema.index({
  createdAt: 1,
  updatedAt: 1,
});

export default ChatSchema;
