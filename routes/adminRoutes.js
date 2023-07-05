import express from "express";
import {
  getAdmin,
  updateAdminImage,
  updateAdminPassword,
  updateAdminPasswordWithoutCheckingOldPassword,
} from "../controllers/adminController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, getAdmin);
router.patch("/me/password", authMiddleware, updateAdminPassword);
router.patch("/image/:id", authMiddleware, updateAdminImage);
router.patch("/password/:id", updateAdminPasswordWithoutCheckingOldPassword);

export default router;
