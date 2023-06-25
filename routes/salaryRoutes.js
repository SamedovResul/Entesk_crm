import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { getSalaries } from "../controllers/salaryController.js";

const router = express.Router();

router.get("/", authMiddleware, getSalaries);

export default router;
