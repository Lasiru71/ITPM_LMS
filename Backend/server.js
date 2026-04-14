const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const paymentRoutes = require("./routes/payment.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const courseRoutes = require("./routes/course.routes");

// Lasiru Routes
const authRoutes = require("./routes/Lasiru/authRoutes");
const adminRoutes = require("./routes/Lasiru/adminRoutes");
const reviewRoutes = require("./routes/Lasiru/reviewRoutes");
const announcementRoutes = require("./routes/Lasiru/announcementRoutes");
const enrollmentRoutes = require("./routes/Lasiru/enrollmentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/courses", courseRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/attendance", attendanceRoutes);

// Lasiru Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/enrollments", enrollmentRoutes);

mongoose
  .connect("mongodb+srv://itpmsliit:ItpmSliit2026@itpm.fwhtwym.mongodb.net/ITPM_LMS?appName=ITPM")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });