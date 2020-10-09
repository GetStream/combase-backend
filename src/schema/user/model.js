import { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const UserSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      description:
        "A reference to the organization that user is associated with.",
    },
    name: {
      required: true,
      trim: true,
      type: String,
      description: "The provided name of the user initiating a chat.",
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      description: "The provided email of the user initiating a chat.",
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
