import { Lesson } from "../models/lessonModel.js";
import { Teacher } from "../models/teacherModel.js";
import {
  createNotificationForLessonsCount,
  createNotificationForUpdate,
} from "./notificationController.js";

// Create lesson
export const createLesson = async (req, res) => {
  const { role } = req.user;

  try {
    const teacher = await Teacher.findById(req.body.teacher);

    const newLesson = new Lesson({ ...req.body, salary: teacher.salary });

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
    if (teacherId === "undefined") {
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
    currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1)
  );
  const endWeek = new Date(currentDate.setDate(currentDate.getDate() + 6));

  startWeek.setHours(0, 0, 0, 0);
  endWeek.setHours(23, 59, 59, 999);

  try {
    if (teacherId === "undefined") {
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

const startWeek = new Date();

startWeek.setDate(startWeek.getDate() - startWeek.getDay() + 1);

// Get weekly lessons for main panel
export const getWeeklyLessonsForMainPanel = async (req, res) => {
  const { startDate, endDate, teacherId, studentId, status } = req.query;
  const { role, id } = req.user;

  try {
    const filterObj = {
      role: "current",
    };

    if (role === "teacher") {
      filterObj.teacher = id;
    } else if (role === "student") {
      filterObj["students.student"] = id;
    } else if (teacherId) {
      filterObj.teacher = teacherId;
    } else if (studentId) {
      filterObj["students.student"] = studentId;
    }

    if (startDate && endDate) {
      filterObj.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    if (status === "confirmed" || status === "cancelled") {
      filterObj.status = status;
    }

    if (attendance === "present") {
      filterObj["students.attendance"] = 1;
    } else if (attendance === "absent") {
      filterObj["students.attendance"] = -1;
    }

    let lessons;

    if (studentId || role === "student") {
      lessons = await Lesson.find(filterObj, {
        students: { $elemMatch: { student: studentId } },
      })
        .populate("teacher course students.student")
        .select("day date time role status note task createdDate");
    } else {
      lessons = await Lesson.find(filterObj).populate(
        "teacher course students.student"
      );
    }

    res.status(200).json(lessons);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Update lesson in current and main table
export const updateLessonInTable = async (req, res) => {
  const { id } = req.params;
  const { role } = req.user;

  try {
    let newLesson = req.body;

    if (newLesson.teacher) {
      const teacher = await Teacher.findById(newLesson.teacher);
      newLesson.salary = teacher.salary;
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(id, newLesson, {
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

    res.status(200).json(updatedLesson);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Update lesson in main panel
export const updateLessonInMainPanel = async (req, res) => {
  const { id } = req.params;
  const { role } = req.user;

  try {
    const lesson = await Lesson.findById(id);
    let newLesson = req.body;

    if (newLesson.teacher) {
      const teacher = await Teacher.findById(newLesson.teacher);
      newLesson.salary = teacher.salary;
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(id, newLesson, {
      new: true,
    }).populate("teacher course students.student");

    if (!updatedLesson) {
      return res.status(404).json({ message: "Lesson not found" });
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

// Delete lesson in table panel

export const deleteLessonInTablePanel = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedLesson = await Lesson.findByIdAndDelete(id);

    if (!deletedLesson) {
      res.status(404).json({ message: "Lesson not found" });
    }

    if (deletedLesson.role === "current") {
      createNotificationForUpdate(
        deletedLesson.teacher,
        deletedLesson.students
      );
    }

    res.status(200).json(deletedLesson);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Delete lesson in main panel
export const deleteLessonInMainPanel = async (req, res) => {
  const { id } = req.params;

  console.log("salam");
  try {
    const deletedLesson = await Lesson.findByIdAndDelete(id);

    if (!deletedLesson) {
      res.status(404).json({ message: "Lesson Not Found" });
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

      const dataObj = data.toObject();
      delete dataObj._id;
      delete dataObj.status;
      return {
        ...dataObj,
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
