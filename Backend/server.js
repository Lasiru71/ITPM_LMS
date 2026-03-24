import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { PORT, MONGO_URI } from "./config.js";

import authRoutes from "./routes/Lasiru/authRoutes.js";
import adminRoutes from "./routes/Lasiru/adminRoutes.js";
import announcementRoutes from "./routes/Lasiru/announcementRoutes.js";

// Jeewani
import jeewaniCourseRoutes from "./routes/Jeewani/courseRoutes.js";
import jeewaniReviewRoutes from "./routes/Jeewani/reviewRoutes.js";

// Sadeepa
import assignmentRoutes from "./routes/sadeepa/assignmentRoutes.js";
import materialRoutes from "./routes/sadeepa/materialRoutes.js";
import projectRoutes from "./routes/sadeepa/projectRoutes.js";
import enrollmentRoutes from "./routes/Lasiru/enrollmentRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// Health check
app.get("/", (req, res) => {
  res.send("Backend Running");
});

// Auth & RBAC routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/announcements", announcementRoutes);

// Jeewani routes
app.use("/api/jeewani/courses", jeewaniCourseRoutes);
app.use("/api/courses", jeewaniCourseRoutes); // alias for easier access
app.use("/api/jeewani/reviews", jeewaniReviewRoutes);

// Sadeepa routes
app.use("/api/sadeepa/assignments", assignmentRoutes);
app.use("/api/sadeepa/materials", materialRoutes);
app.use("/api/sadeepa/projects", projectRoutes);
app.use("/api/enrollments", enrollmentRoutes);

// MongoDB connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));