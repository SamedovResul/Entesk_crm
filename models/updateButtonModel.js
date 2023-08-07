import mongoose from "mongoose";

const Schema = mongoose.Schema;

const updateButtonSchema = new Schema(
  {
    disabled: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

export const UpdateButton = mongoose.model("UpdateButton", updateButtonSchema);
