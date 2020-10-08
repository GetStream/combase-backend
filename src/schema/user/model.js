import { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const UserSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    name: {
      required: true,
      trim: true,
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
    },
  },
  { collection: "users" }
);

UserSchema.plugin(timestamps);

UserSchema.index({
  createdAt: 1,
  updatedAt: 1,
});

export default UserSchema;
