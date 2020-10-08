import { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const FaqSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
        required: true,
      },
    ],
    title: {
      type: String,
      trim: true,
      required: true,
    },
    body: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { collection: "faqs" }
);

FaqSchema.plugin(timestamps);

FaqSchema.index({
  createdAt: 1,
  updatedAt: 1,
});

export default FaqSchema;
