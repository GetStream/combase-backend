import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const AgentSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      autopopulate: true,
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
      autopopulate: true,
    },
    name: {
      first: {
        required: true,
        trim: true,
        type: String,
      },
      last: {
        required: true,
        trim: true,
        type: String,
      },
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
    },
    password: {},
    active: {
      type: Boolean,
      default: true,
    },
  },
  { collection: "agents" }
);

AgentSchema.plugin(timestamps);

AgentSchema.index({
  createdAt: 1,
  updatedAt: 1,
});

export default mongoose.model("Agent", AgentSchema);
export { AgentSchema };
