import express from "express";
import { createLesson, updateLesson } from "../controllers/lessonController.js";

const router = express.Router();

router.post("/", createLesson);
router.patch("/:id", updateLesson);


export default router;
