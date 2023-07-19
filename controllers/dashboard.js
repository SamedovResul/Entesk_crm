import { Lesson } from "../models/lessonModel";

export const getDahsboardData = async (req, res) => {
  try {
    const confirmedLessons = await Lesson.find({ status: "confirmed" });
    const cancelledLessons = await Lesson.find({ status: "cancelled" });

    const result = {
      confirmed: confirmedLessons.length,
      cancelled: cancelledLessons.length,
    };

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};
