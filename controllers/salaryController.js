import { Lesson } from "../models/lessonModel.js";
import { Teacher } from "../models/teacherModel.js";
// Get salary

const getSalaries = async (req, res) => {
  const { teacherId, startDate, endDate } = req.query;

  const filterObj = {
    status: "confirmed",
    role: "current",
  };

  if (teacherId) {
    filterObj.teacherId = teacherId;
  }
  if (startDate && endDate) {
    filterObj.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  try {
    const lessons = await Lesson.find(filterObj);
    let teachers;

    if (teacherId) {
      teachers = await Teacher.find({ _id: teacherId });
    } else {
      teachers = await Teacher.find();
    }

    const response = teachers.map((teacher) => {
      const teacherLessons = lessons.filter(
        (lesson) => lesson.teacher == teacher._id
      );

      return {
        teacher,
        confirmed: 
      }
    });
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};
