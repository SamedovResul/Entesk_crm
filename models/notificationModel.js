import mongoose from "mongoose";

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  role: {
    type: String,
    enum: ["birthday", "count", "update-student-table", "update-teacher-table"],
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: function () {
      return this.role !== "update-teacher-table";
    },
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: function () {
      return this.role === "update-teacher-table";
    },
  },
  isZeroClassCount: {
    type: Boolean,
    required: function () {
      return this.role === "count";
    },
  },
  isUpdatedTable: {
    type: Boolean,
    required: function () {
      return (
        this.role === "update-teacher-table" ||
        this.role === "update-student-table"
      );
    },
  },
  isBirthday: {
    type: Boolean,
    required: function () {
      return this.role === "birthday";
    },
  },
  isViewed: {
    type: Boolean,
    default: false,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

export const Notification = mongoose.model("Notification", notificationSchema);
