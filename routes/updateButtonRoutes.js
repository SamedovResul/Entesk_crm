import express from "express";
import { getUpdateButtonStatus } from "../controllers/updateButtonController.js";

const router = express.Router();

router.get("/", getUpdateButtonStatus);

export default router;
