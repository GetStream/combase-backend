import { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const ChatSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      description:
        "A reference to the organization the chat is associated with.",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      description: "A reference to the user who created a chat.",
    },
    agents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Agent",
        required: true,
        description: "A reference to the agent assigned to a chat.",
      },
    ],
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: false,
      description: "A reference to the group the a chat is assigned to.",
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
        required: false,
        description: "Tag for categorizing a chat.",
      },
    ],
    labels: [
      {
        type: String,
        enum: ["priority", "starred"],
        description: "Label for categorizing a chat.",
      },
    ],
    notes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Note",
        required: false,
        description:
          "Internal notes for a chat – visible to organization agents only.",
      },
    ],
    sentiment: {
      type: String,
      enum: ["negative", "nuetral", "positive"],
      defualt: "neutral",
      description: "The sentiment of a chat – on a scale of 0 to 2.",
    },
    status: {
      type: String,
      enum: ["open", "closed", "archived"],
      default: "open",
      description: "The status of the chat.",
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
