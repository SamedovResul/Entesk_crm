import { Lesson } from "../models/lessonModel.js";

// Create lesson
export const createLesson = async (req, res) => {
  try {
    const newLesson = new Lesson(req.body);

    await newLesson.save();

    res.status(201).json(newLesson);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Get lesson
export const getLesson = async (req, res) => {
  const { id } = req.params;

  try {
    const lesson = await Lesson.findById(id);

    if (!lesson) {
      res.status(404).json({ message: "Lesson not found" });
    }

    res.status(200).json(lesson);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Get weekly lessons
export const getWeeklyLessons = async (req, res) => {
  const { startDate, endDate, teacherId, studentId } = req.body;

  try {
    let lessons;
    if (teacherId) {
      lessons = await CurrentTable.find({
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
        teacher: teacherId,
      });
    } else if (studentId) {
      lessons = await CurrentTable.find({
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
        students: studentId,
      });
    }

    res.status(200).json(lessons);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Get current weekly lessons

export const getCurrentWeeklyLessons = async (req, res) => {
  const { id } = req.params;

  try {
    let lessons = await Lesson.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
      teacher: id,
    });

    res.status(200).json(lessons);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Update lesson
export const updateLesson = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedLesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.status(200).json(updatedLesson);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Delete lesson
export const deleteLesson = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedLesson = await Lesson.findByIdAndDelete(id);

    if (!deleteLesson) {
      res.status(404).json({ message: "Lesson not found" });
    }

    res.status(200).json(deleteLesson);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Create current table
export const copyMainTableToCurrentTable = async () => {
  try {
    const mainTableData = await Lesson.find({ role: "main" });

    const currentWeekStart = new Date();

    if (currentWeekStart.getDay() !== 0) {
      currentWeekStart.setDate(
        currentWeekStart.getDate() - currentWeekStart.getDay() + 1
      );
    } else {
      if (currentWeekStart.getHours > 19) {
        currentWeekStart.setDate(currentWeekStart.getDate() + 1);
      } else {
        currentWeekStart.setDate(currentWeekStart.getDate() - 6);
      }
    }

    const currentTableData = mainTableData.map((data) => {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + data.day - 1);

      return {
        ...data.toObject(),
        date,
      };
    });

    const lessons = new Lesson(currentTableData);

    await Lesson.insertMany(lessons);

    res.status(201).json(lessons);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};
