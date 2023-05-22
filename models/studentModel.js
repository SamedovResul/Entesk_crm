import mongoose from "mongoose";

const Schema = mongoose.Schema;

const studentSchema = new Schema({
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
  birthday: {
    type: Date,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  amount: {
    type: Number,
    require: true,
  },
  classes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

export const Student = mongoose.model("Student", studentSchema);
