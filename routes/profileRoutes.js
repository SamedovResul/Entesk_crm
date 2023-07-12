import express from "express";
import { uploadProfileImage } from "../controllers/profileController.js";

const router = express.Router();

router.patch("/image/upload", uploadProfileImage);

export default router;
