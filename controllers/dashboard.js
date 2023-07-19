import { Lesson } from "../models/lessonModel";
import { Student } from "../models/studentModel";

export const getDahsboardData = async (req, res) => {
  try {
    const confirmedLessons = await Lesson.find({ status: "confirmed" });
    const cancelledLessons = await Lesson.find({ status: "cancelled" });
    const studentsCountAz = await Student.countDocuments({
      status: true,
      sector: "AZ",
    });
    const studentsCountEn = await Student.countDocuments({
      status: true,
      sector: "EN",
    });
    const studentsCountRu = await Student.countDocuments({
      status: true,
      sector: "RU",
    });

    const earnings = confirmedLessons.reduce((total, curr) => {
      return (total += curr.earnings);
    }, 0);

    const result = {
      confirmedCount: confirmedLessons.length,
      cancelledCount: cancelledLessons.length,
      allStudentsCount: studentsCountAz + studentsCountEn + studentsCountRu,
      studentsCountAz,
      studentsCountEn,
      studentsCountRu,
      earnings,
    };

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};
