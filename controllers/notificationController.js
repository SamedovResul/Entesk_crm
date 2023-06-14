import { Notification } from "../models/notificationModel";

// Create notification
export const createNotificationForBirthday = async (req, res) => {
  try {
  } catch (err) {
    res.status(500).json({ message: { error: err.message } });
  }
};
