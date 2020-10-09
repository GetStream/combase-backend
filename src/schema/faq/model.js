import { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const FaqSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      description:
        "A reference to the organization to the FAQ is associated with.",
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
        required: true,
        description: "Tag used to categorize a FAQ.",
      },
    ],
    title: {
      type: String,
      trim: true,
      required: true,
      description: "Title of the FAQ.",
    },
    body: {
      type: String,
      trim: true,
      required: true,
      description: "Body of the FAQ.",
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
