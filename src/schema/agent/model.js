import { Schema } from "mongoose";
import bcrypt from "mongoose-bcrypt";
import timestamps from "mongoose-timestamp";

const AgentSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    name: {
      full: {
        trim: true,
        type: String,
        required: true,
        description: "Full name of the agent for internal purposes only.",
      },
      display: {
        trim: true,
        type: String,
        required: true,
        description: "The publicly visible name of the agent.",
      },
    },
    title: {
      type: String,
      trim: true,
      default: "Support Agent",
    },
    avatar: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      bcrypt: true,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { collection: "agents" }
);

AgentSchema.plugin(bcrypt);
AgentSchema.plugin(timestamps);

AgentSchema.index({
  createdAt: 1,
  updatedAt: 1,
});

export default AgentSchema;
