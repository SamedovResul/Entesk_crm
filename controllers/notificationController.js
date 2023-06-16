import { Notification } from "../models/notificationModel.js";
import { Student } from "../models/studentModel.js";

// CREATE NOTIFICATION

// Create notification for birthday
export const createNotificationForBirthday = async () => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 3);
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;

  try {
    const birthdayStudents = await Student.find({
      $expr: {
        $and: [
          { $eq: [{ $dayOfMonth: "$birthday" }, currentDay] },
          { $eq: [{ $month: "$birthday" }, currentMonth] },
        ],
      },
      status: true,
    });
    console.log(birthdayStudents);
    birthdayStudents.map(async (student) => {
      await Notification.create({
        role: "birthday",
        student: student._id,
        isBirthday: true,
      });
    });
  } catch (err) {
    console.log({ message: { error: err.message } });
  }
};

// Create notification for update table
export const createNotificationForUpdate = async (teacherId, studentIds) => {
  try {
    await Notification.create({
      role: "update-teacher-table",
      teacher: teacherId,
      isUpdatedTable: true,
    });

    studentIds.map(async (studentId) => {
      await Notification.create({
        role: "update-student-table",
        student: studentId,
        isUpdatedTable: true,
      });
    });
  } catch (err) {
    console.log({ message: { error: err.message } });
  }
};

// GET NOTIFICATIONS

// Get notifications for admin
export const getNotificationsForAdmin = async (req, res) => {
  const { studentId } = req.query;
  try {
    const notifications = await Notification.find({
      student: studentId,
      role: { $in: ["birhtday", "count"] },
    });

    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};

// Get notifications for teacher
