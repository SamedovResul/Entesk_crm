import { Lesson } from "../models/lessonModel.js";
import { Teacher } from "../models/teacherModel.js";
import bcrypt from "bcrypt";

// Get teachers
export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate("courses");
    res.status(200).json(teachers);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Get Teacher
export const getTeacher = async (req, res) => {
  const { id } = req.user;
  try {
    const teacher = await Teacher.findById(id);

    if (!teacher) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(teacher);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Update student
export const updateTeacher = async (req, res) => {
  const { id } = req.params;
  let updatedData = req.body;

  try {
    if (updatedData.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(updatedData.password, salt);
      updatedData = { ...updatedData, password: hashedPassword };
    }

    const updatedTeacher = await Teacher.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    }).populate("courses");

    if (!updatedTeacher) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(updatedTeacher);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Delete teacher

export const deleteTeacher = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(id);

    if (!deletedTeacher) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student successfully deleted" });
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Update teacher password
export const updateTeacherPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { id } = req.user;

  try {
    const teacher = await Teacher.findById(id);

    if (!teacher) {
      return res.status(404).json({ message: "Student not found." });
    }

    const isPasswordCorrect = await bcrypt.compare(
      oldPassword,
      teacher.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Old password is incorrect." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    res.status(200).json(updatedTeacher);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Update student profile image
export const updateTeacherImage = async (req, res) => {
  const { id } = req.params;
  const { profileImage } = req.body;

  try {
    const buffer = Buffer.from(profileImage, "base64");

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      id,
      {
        profileImage: buffer,
      },
      { new: true }
    );

    if (!updatedTeacher) {
      res.status(404).json({ message: "Not found student" });
    }

    const base64Image = Buffer.from(updatedTeacher.profileImage).toString(
      "base64"
    );

    const objTeacher = updatedStudent.toObject();
    objTeacher.profileImage = base64Image;

    res.status(200).json(objTeacher);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Calculate teacher salary

export const calculateSalary = async (req, res) => {
  const { teacherId, startDate, endDate } = req.query;

  try {
    let salaryInfo;
    if (teacherId && startDate && endDate) {
      const lessons = await Lesson.find({
        teacher: teacherId,
        date: {
          $gte: startDate,
          $lt: endDate,
        },
      });

      salaryInfo = lessons.map((item) => {
        return {};
      });
    } else if (teacherId) {
      let currentDate = new Date();
      let firstDateOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      let lastDateOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );
      lastDateOfMonth.setHours(23, 59, 59, 999);

      salaryInfo = await Lesson.find({
        teacher: teacherId,
        date: {
          $gte: firstDateOfMonth,
          $lt: lastDateOfMonth,
        },
      });
    }
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};
