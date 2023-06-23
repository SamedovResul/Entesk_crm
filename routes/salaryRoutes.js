import express from "express";
import router from "./studentRoutes";
import { authMiddleware } from "../middleware/auth";
import { getSalaries } from "../controllers/salaryController";

const router = express.Router();

router.get("/", authMiddleware, getSalaries);

export default router;
