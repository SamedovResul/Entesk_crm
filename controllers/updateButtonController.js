import { Lesson } from "../models/lessonModel.js";
import { UpdateButton } from "../models/updateButtonModel.js";

// Get update button disable status
export const getUpdateButtonStatus = async (req, res) => {
  try {
    const updateButton = await UpdateButton.findOne();

    if (updateButton) {
      return res.status(200).json(updateButton);
    }

    const currentDate = new Date();
    const startWeek = new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1)
    );
    const endWeek = new Date(currentDate.setDate(currentDate.getDate() + 6));

    startWeek.setHours(0, 0, 0, 0);
    endWeek.setHours(23, 59, 59, 999);

    const lessonsCount = await Lesson.find({
      date: {
        $gte: startWeek,
        $lte: endWeek,
      },
      role: "current",
    });

    console.log(startWeek, endWeek);
    console.log(lessonsCount);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

getUpdateButtonStatus();
