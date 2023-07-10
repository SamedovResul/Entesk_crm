import express from "express";
import {
  getNotificationsForAdmin,
  getNotificationsForStudent,
  getNotificationsForTeacher,
} from "../controllers/notificationController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/admin", authMiddleware, getNotificationsForAdmin);
router.get("/teacher", authMiddleware, getNotificationsForTeacher);
router.get("/student", authMiddleware, getNotificationsForStudent);

export default router;
