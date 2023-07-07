import mongoose from "mongoose";

const Schema = mongoose.Schema;

const adminSchema = new Schema({
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
  profileImage: {
    type: Buffer,
    default: null,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

export const Admin = mongoose.model("Admin", adminSchema);
