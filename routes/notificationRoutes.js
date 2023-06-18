import express from "express";
import { getNotificationsForAdmin } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/admin", getNotificationsForAdmin);

export default router;
