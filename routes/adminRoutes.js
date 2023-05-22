import express from "express";
import {
  getAdmin,
  updateAdminPassword,
} from "../controllers/adminController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, getAdmin);
router.patch("/password", authMiddleware, updateAdminPassword);

export default router;
