import mongoose from "mongoose";

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  isZeroClassCount: {
    type: Boolean,
    default: false,
  },
  isUpdatedTable: {
    type: Boolean,
    default: false,
  },
  isBirthday: {
    type: Boolean,
    default: false,
  },
  isViewed: {
    type: Boolean,
    default: false,
  },
});

export const Notification = mongoose.model("Notification", notificationSchema);
