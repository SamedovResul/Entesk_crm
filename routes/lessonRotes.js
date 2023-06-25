import express from "express";
import {
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
router.post("/", authMiddleware, createLesson);
router.patch("/:id", authMiddleware, updateLesson);
router.delete("/:id", authMiddleware, deleteLesson);

export default router;
