import mongoose from "mongoose";

const Schema = mongoose.Schema;

const profileImageSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  profileImage: {
    type: Buffer,
    default: null,
  },
});

export const ProfileImage = mongoose.model("profileImage", profileImageSchema);
