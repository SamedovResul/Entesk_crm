import { Lesson } from "../models/lessonModel.js";
import { Teacher } from "../models/teacherModel.js";

// Get salaries

export const getSalaries = async (req, res) => {
  const { teacherId, startDate, endDate } = req.query;

  const filterObj = {
    status: { $ne: "unviewed" },
    role: "current",
  };

  if (teacherId) {
    filterObj.teacher = teacherId;
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

      const confirmed = teacherLessons.filter(
        (lesson) => lesson.status === "confirmed"
      );

      const cancelled = teacherLessons.filter(
        (lesson) => lesson.status === "cancelled"
      );

      const participantCount = confirmed.reduce(
        (total, current) =>
          (total += current.students.filter(
            (item) => item.attended === 1
          ).length),
        0
      );

      const total = confirmed.reduce(
        (total, current) =>
          (total +=
            current.students.filter((item) => item.attended === 1).length *
            current.salary),
        0
      );

      return {
        teacher,
        confirmed: confirmed.length,
        cancelled: cancelled.length,
        participantCount,
        salary: teacher.salary,
        total: total,
      };
    });

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};
