const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const paymentRoutes = require("./routes/payment.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const courseRoutes = require("./routes/course.routes");

const app = express();

app.use(cors());
app.use(express.json());

// serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const authRoutes = require("./routes/Lasiru/authRoutes");
const adminRoutes = require("./routes/Lasiru/adminRoutes");
const announcementRoutes = require("./routes/Lasiru/announcementRoutes");
const reviewRoutes = require("./routes/Lasiru/reviewRoutes");

app.use("/api/courses", courseRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/reviews", reviewRoutes);

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://itpmsliit:ItpmSliit2026@itpm.fwhtwym.mongodb.net/ITPM_LMS?appName=ITPM";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });