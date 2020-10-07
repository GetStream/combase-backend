import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const TeamSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      autopopulate: true,
    },
    name: {
      required: true,
      trim: true,
      type: String,
    },
    logo: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { collection: "teams" }
);

TeamSchema.plugin(timestamps);

TeamSchema.index({
  createdAt: 1,
  updatedAt: 1,
});

export default mongoose.model("Team", TeamSchema);
export { TeamSchema };
