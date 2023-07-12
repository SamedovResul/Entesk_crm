import express from "express";
import {
  getProfileImage,
  uploadProfileImage,
} from "../controllers/profileController.js";

const router = express.Router();

router.get("/image", getProfileImage);
router.patch("/image/upload", uploadProfileImage);

export default router;
