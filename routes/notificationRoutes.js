import express from "express";
import { getNotificationsForAdmin } from "../controllers/notificationController";

const router = express.Router();

router.get("/admin", getNotificationsForAdmin);

export default router;
