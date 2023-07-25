import mongoose from "mongoose";

const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    students: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    teachers: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  },
  { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);
