import mongoose from "mongoose";

const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  category: { type: Array },
  students: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  teachers: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
  },
});

export const Course = mongoose.model("Course", courseSchema);
