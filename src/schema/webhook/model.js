import { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const WebhookSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    url: {
      type: String,
      trim: true,
      unqiue: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      unqiue: true,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "webhooks" }
);

WebhookSchema.plugin(timestamps);

WebhookSchema.index({
  createdAt: 1,
  updatedAt: 1,
});

export default WebhookSchema;
