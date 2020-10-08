import { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const AssetSchema = new Schema(
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
  },
  { collection: "assets" }
);

AssetSchema.plugin(timestamps);

AssetSchema.index({
  createdAt: 1,
  updatedAt: 1,
});

export default AssetSchema;
