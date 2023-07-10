import express from "express";
import {
  changeForgottenPassword,
  login,
  registerAdmin,
  registerStudent,
  registerTeacher,
  refreshToken,
  getUser,
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, getUser);
router.post("/admin/sign", registerAdmin);
router.post("/student/sign", authMiddleware, registerStudent);
router.post("/teacher/sign", authMiddleware, registerTeacher);
router.post("/login", login);
router.get("/refresh_token", refreshToken);
router.post("/login/forget", changeForgottenPassword);

export default router;
