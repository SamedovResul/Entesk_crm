import express from "express";
import {
  createLesson,
  deleteLesson,
  getLessons,
  updateLesson,
} from "../controllers/lessonController.js";

const router = express.Router();

router.get("/", getLessons);
router.post("/", createLesson);
router.patch("/:id", updateLesson);
router.delete("/:id", deleteLesson);

export default router;
