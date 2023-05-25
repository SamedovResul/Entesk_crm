import mongoose from "mongoose";

const Schema = mongoose.Schema;

const studentSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  parentName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  classes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

export const Student = mongoose.model("Student", studentSchema);