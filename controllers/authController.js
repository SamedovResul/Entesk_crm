import { Student } from "../models/studentModel.js";
import { Course } from "../models/courseModel.js";
import { Teacher } from "../models/teacherModel.js";
import { Admin } from "../models/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register admin
export const registerAdmin = async (req, res) => {
  const { email } = req.body;
  try {
    const existingStudent = await Student.findOne({ email });
    const existingTeacher = await Teacher.findOne({ email });
    const adminCount = await Admin.countDocuments();

    console.log(existingStudent);
    if (existingStudent || existingTeacher) {
      return res
        .status(400)
        .json({ message: "A user with the same email already exists" });
    }

    if (adminCount > 0) {
      return res.status(400).json({ message: "A admin already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const admin = new Admin({ ...req.body, password: hashedPassword });
    await admin.save();

    res.status(201).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Register student
export const registerStudent = async (req, res) => {
  const { email } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ email });
    const existingStudent = await Student.findOne({ email });
    const existingTeacher = await Teacher.findOne({ email });

    if (existingAdmin || existingStudent || existingTeacher) {
      return res
        .status(400)
        .json({ message: "A user with the same email already exists" });
    }

    const coursesId = req.body.courses;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const student = new Student({ ...req.body, password: hashedPassword });
    await student.save();

    await Course.updateMany(
      { _id: { $in: coursesId } },
      { $addToSet: { students: student._id } }
    );

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Register teacher
export const registerTeacher = async (req, res) => {
  const { email } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ email });
    const existingStudent = await Student.findOne({ email });
    const existingTeacher = await Teacher.findOne({ email });

    if (existingAdmin || existingStudent || existingTeacher) {
      return res
        .status(400)
        .json({ message: "A user with the same email already exists" });
    }

    const coursesId = req.body.courses;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const teacher = new Teacher({ ...req.body, password: hashedPassword });
    await teacher.save();

    await Course.updateMany(
      { _id: { $in: coursesId } },
      { $addToSet: { teachers: teacher._id } }
    );

    res.status(201).json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    const student = await Student.findOne({ email });
    const teacher = await Teacher.findOne({ email });

    const user = admin || student || teacher;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(404).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "10m" }
    );

    const cleanedUser = user.toObject();
    delete cleanedUser.password;
    res.status(200).json({ user: cleanedUser, token });
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};
