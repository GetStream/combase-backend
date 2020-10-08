import { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const TagSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      unqiue: true,
      required: true,
    },
  },
  { collection: "tags" }
);

TagSchema.plugin(timestamps);

TagSchema.index({
  createdAt: 1,
  updatedAt: 1,
});

export default TagSchema;
