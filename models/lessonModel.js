import mongoose from "mongoose";

const Schema = mongoose.Schema;

const lessonSchema = new Schema({
  role: {
    type: String,
    required: true,
    enum: ["main", "current"],
  },
  date: {
    type: Date,
    required: function () {
      return this.role === "current";
    },
  },
  time: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Teacher",
  },
  students: {
    type: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
        },
        attendance: {
          type: Boolean,
          default: null,
        },
      },
    ],
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  confirmed: {
    type: Boolean,
    default: null,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

export const Lesson = mongoose.model("Lesson", lessonSchema);
