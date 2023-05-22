import express from "express";
import {
  deleteStudent,
  getStudents,
  updateStudent,
  getStudent,
  updateStudentPassword,
} from "../controllers/studentController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, getStudents);
router.get("/:id", authMiddleware, getStudent);
router.patch("/:id", authMiddleware, updateStudent);
router.delete("/:id", authMiddleware, deleteStudent);
router.patch("/me/password", authMiddleware, updateStudentPassword);

export default router;
