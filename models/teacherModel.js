import mongoose from "mongoose";

const Schema = mongoose.Schema;

const teacherSchema = new Schema(
  {
    fullName: {
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
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    salary: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      default: "teacher",
    },
  },
  { timestamps: true }
);

teacherSchema.index({ createdAt: -1 });

export const Teacher = mongoose.model("Teacher", teacherSchema);
