import mongoose from "mongoose";

const Schema = mongoose.Schema;

const adminSchema = new Schema(
  {
    fullName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      default: "admin",
    },
  },
  { timestamps: true }
);

adminSchema.index({ createdAt: -1 });

export const Admin = mongoose.model("Admin", adminSchema);
