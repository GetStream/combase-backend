import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const OrganizationSchema = new Schema(
  {
    name: {
      required: true,
      type: String,
    },
    contact: {
      email: {
        type: String,
        trim: true,
        default: "",
      },
      phone: {
        type: String,
        trim: true,
        default: "",
      },
    },
    branding: {
      logo: {
        type: String,
        trim: true,
      },
      colors: {
        primary: {
          type: String,
          trim: true,
        },
        secondary: {
          type: String,
          trim: true,
        },
      },
    },
  },
  { collection: "organizations" }
);

OrganizationSchema.plugin(timestamps);

OrganizationSchema.index({
  createdAt: 1,
  updatedAt: 1,
});

export default mongoose.model("Organization", OrganizationSchema);
export { OrganizationSchema };
