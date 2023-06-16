import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import lessonRoutes from "./routes/lessonRotes.js";
import cron from "node-cron";
import { createNotificationForBirthday } from "./controllers/notificationController.js";

dotenv.config();

const app = express();
const port = process.env.PORT;
const uri = process.env.DB_URI;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/user/auth", authRoutes);
app.use("/api/user/student", studentRoutes);
app.use("/api/user/teacher", teacherRoutes);
app.use("/api/user/admin", adminRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/lesson", lessonRoutes);

app.get("/", (req, res) => {
  res.send("salam");
});

mongoose
  .connect(uri)
  .then(() => {
    console.log("connected database");
    app.listen(port, () => {
      console.log(`listen server at ${port}`);
      cron.schedule("0 9 * * *", () => {
        console.log("salam");
        createNotificationForBirthday();
      });
    });
  })
  .catch((err) => console.log(err));
// "0 9 * * *"
