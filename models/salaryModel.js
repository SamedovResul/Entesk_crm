import mongoose from "mongoose";

const Schema = mongoose.Schema;

const salarySchema = new Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  confirmed: {
    type: Number,
    default: 0,
  },
  canceled: {
    type: Number,
    default: 0,
  },
  participantCount: {
    type: Number,
    default: 0,
  },
  salary: {
    type: Number,
    required: true,
  },
  totalSalary: {
    type: Number,
    default: 0,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

export const Salary = mongoose.model("Salary", salarySchema);
