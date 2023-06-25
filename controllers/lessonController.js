import { Lesson } from "../models/lessonModel.js";
import {
  createNotificationForLessonsCount,
  createNotificationForUpdate,
} from "./notificationController.js";

// Create lesson
export const createLesson = async (req, res) => {
  const { role } = req.user;

  try {
    const newLesson = new Lesson(req.body);

    await newLesson.populate("teacher course students.student");

    await newLesson.save();

    if (newLesson.role === "current" && role === "admin") {
      createNotificationForUpdate(newLesson.teacher._id, newLesson.students);
    }

    res.status(201).json(newLesson);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// ----------------------------------------------------------------------
// Get lesson
// export const getLesson = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const lesson = await Lesson.findById(id);

//     if (!lesson) {
//       res.status(404).json({ message: "Lesson not found" });
//     }

//     res.status(200).json(lesson);
//   } catch (err) {
//     res.status(500).json({ message: { error: err.message } });
//   }
// };

// Get lessons
// export const getLessons = async (req, res) => {
//   try {
//     const lessons = await Lesson.find().populate(
//       "teacher course students.student"
//     );

//     res.status(200).json(lessons);
//   } catch (err) {
//     res.status(500).json({ message: { error: err.message } });
//   }
// };
// ------------------------------------------------------------------------------------

// Get weekly lessons for main table
export const getWeeklyLessonsForMainTable = async (req, res) => {
  const { teacherId } = req.query;

  try {
    if (!teacherId) {
      return res.status(200).json([]);
    }

    const lessons = await Lesson.find({
      teacher: teacherId,
      role: "main",
    }).populate("teacher course students.student");

    res.status(200).json(lessons);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Get weekly lessons for current table
export const getWeeklyLessonsForCurrentTable = async (req, res) => {
  const { teacherId } = req.query;
  const currentDate = new Date();
  const startWeek = new Date(
    currentDate.setDate(currentDate.getDate() - currentDate.getDay())
  );
  const endWeek = new Date(startWeek.setDate(startWeek.getDate() + 6));

  try {
    if (!teacherId) {
      return res.status(200).json([]);
    }

    const lessons = await Lesson.find({
      teacher: teacherId,
      role: "current",
      date: {
        $gte: startWeek,
        $lte: endWeek,
      },
    }).populate("teacher course students.student");

    res.status(200).json(lessons);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Get weekly lessons for admin main panel
export const getWeeklyLessonsForAdminMainPanel = async (req, res) => {
  const { startDate, endDate, teacherId, studentId, status } = req.query;

  try {
    const filterObj = {
      role: "current",
    };

    if (teacherId) {
      filterObj.teacher = teacherId;
    } else if (studentId) {
      filterObj.student = studentId;
    }

    if (startDate && endDate) {
      filterObj.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    if (status === "confirmed" || status === "canceled") {
      filterObj.status = status;
    }

    const lessons = await Lesson.find(filterObj).populate(
      "teacher course students.student"
    );

    res.status(200).json(lessons);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Update lesson
export const updateLesson = async (req, res) => {
  const { id } = req.params;
  const { role } = req.user;

  try {
    const lesson = await Lesson.findById(id);
    const updatedLesson = await Lesson.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate("teacher course students.student");

    if (!updatedLesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    if (updatedLesson.role === "current" && role === "admin") {
      createNotificationForUpdate(
        updatedLesson.teacher._id,
        updatedLesson.students
      );
    }

    if (
      role === "admin" &&
      req.body.status === "confirmed" &&
      lesson.status !== "confirmed"
    ) {
      createNotificationForLessonsCount(updatedLesson);
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

    if (!deletedLesson) {
      res.status(404).json({ message: "Lesson not found" });
    }

    if (deletedLesson.role === "current") {
      createNotificationForUpdate(deletedLesson.teacher, students.student);
    }

    res.status(200).json(deletedLesson);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Create current lessons from main lessons
export const createCurrentLessonsFromMainLessons = async (req, res) => {
  try {
    const mainTableData = await Lesson.find({
      role: "main",
    });

    const currentWeekStart = new Date();

    if (currentWeekStart.getDay() !== 0) {
      currentWeekStart.setDate(
        currentWeekStart.getDate() - currentWeekStart.getDay() + 1
      );
    } else {
      if (currentWeekStart.getHours() > 19) {
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
        date: date,
        role: "current",
      };
    });

    await Lesson.insertMany(currentTableData);

    res.status(201).json({ message: "Create current tables" });
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};
