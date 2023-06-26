import express from "express";
import {
  createCurrentLessonsFromMainLessons,
  createLesson,
  deleteLesson,
  getWeeklyLessonsForCurrentTable,
  getWeeklyLessonsForMainTable,
  updateLesson,
} from "../controllers/lessonController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/main", authMiddleware, getWeeklyLessonsForMainTable);
router.get("/current", authMiddleware, getWeeklyLessonsForCurrentTable);
router.get("/main/panel", authMiddleware, getWeeklyLessonsForMainTable);
router.post("/", authMiddleware, createLesson);
router.post(
  "/current/all",
  authMiddleware,
  createCurrentLessonsFromMainLessons
);
router.patch("/:id", authMiddleware, updateLesson);
router.delete("/:id", authMiddleware, deleteLesson);

export default router;
