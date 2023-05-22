import mongoose from "mongoose";

const Schema = mongoose.Schema;

const teacherSchema = new Schema({
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
  classes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  salary: {
    type: Number,
    require: true,
  },
});

export const Teacher = mongoose.model("Teacher", teacherSchema);
