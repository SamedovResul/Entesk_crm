import { Lesson } from "../models/lessonModel.js";
import { Student } from "../models/studentModel.js";
import bcrypt from "bcrypt";

// Get students
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("courses");
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Get Student
export const getStudent = async (req, res) => {
  const { id } = req.user;
  try {
    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Get students by course id
export const getStudentsByCourseId = async (req, res) => {
  const { courseId, day, time, role, date } = req.query;
  console.log(day, time, role);
  try {
    const students = await Student.find({ courses: courseId });

    const newStudents = await Promise.all(
      students.map(async (student) => {
        let checkStudent;

        if (role === "main") {
          console.log(student._id, day, time, role);
          checkStudent = await Lesson.find({
            "students.studentId": student._id,
            day,
            time,
            role,
          });
        } else if (role === "current") {
          checkStudent = await Lesson.find({
            "students.studentId": student._id,
            day,
            time,
            role,
            date,
          });
        }

        if (checkStudent) {
          return { ...student.toObject(), disable: true };
        } else {
          return { ...student.toObject(), disable: false };
        }
      })
    );

    res.status(200).json(newStudents);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Update student
export const updateStudent = async (req, res) => {
  const { id } = req.params;
  let updatedData = req.body;

  try {
    if (updatedData.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(updatedData.password, salt);
      updatedData = { ...updatedData, password: hashedPassword };
    }

    const updatedStudent = await Student.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    }).populate("courses");

    if (!updateStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(updatedStudent);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Delete student

export const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student successfully deleted" });
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Update student password
export const updateStudentPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { id } = req.user;

  try {
    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    const isPasswordCorrect = await bcrypt.compare(
      oldPassword,
      student.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Old password is incorrect." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    const cleanedUpdatedStudent = updatedStudent.toObject();
    delete cleanedUpdatedStudent.password;

    res.status(200).json(cleanedUpdatedStudent);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};
