import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { PORT, MONGO_URI } from "./config.js";
import authRoutes from "./routes/Lasiru/authRoutes.js";
import adminRoutes from "./routes/Lasiru/adminRoutes.js";
import announcementRoutes from "./routes/Lasiru/announcementRoutes.js";
import jeewaniCourseRoutes from "./routes/Jeewani/courseRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Health check
app.get("/", (req, res) => {
  res.send("Backend Running");
});

// Auth & RBAC routes (Lasiru)
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/announcements", announcementRoutes);

// Jeewani routes
app.use("/api/jeewani/courses", jeewaniCourseRoutes);

// MongoDB connection (modern Mongoose 9+)
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
