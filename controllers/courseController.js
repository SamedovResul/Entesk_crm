import { Course } from "../models/courseModel.js";

// Get courses

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Create course
export const createCourse = async (req, res) => {
  const { name } = req.body;
  try {
    const existingCourse = await Course.findOne({ name });
    if (existingCourse) {
      return res
        .status(400)
        .json({ message: "A class with the same name already exists" });
    }

    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ errror: err.message });
  }
};

// Update class
export const updateCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedCourse = await Course.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCourse) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json(updatedCourse);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Delete class

export const deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json({ message: "Class successfully deleted" });
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};
