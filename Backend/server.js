const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Standard Routes
const paymentRoutes = require("./routes/payment.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const courseRoutes = require("./routes/Jeewani/courseRoutes");

// Lasiru Module Routes
const authRoutes = require("./routes/Lasiru/authRoutes");
const adminRoutes = require("./routes/Lasiru/adminRoutes");
const reviewRoutes = require("./routes/Lasiru/reviewRoutes");
const announcementRoutes = require("./routes/Lasiru/announcementRoutes");
const enrollmentRoutes = require("./routes/Lasiru/enrollmentRoutes");

// Sadeepa Module Routes
const assignmentRoutes = require("./routes/sadeepa/assignmentRoutes");
const materialRoutes = require("./routes/sadeepa/materialRoutes");
const projectRoutes = require("./routes/sadeepa/projectRoutes");

// Jeewani Module Routes
const jeewaniCourseRoutes = require("./routes/Jeewani/courseRoutes");
const jeewaniReviewRoutes = require("./routes/Jeewani/reviewRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Standard Endpoints
app.use("/api/courses", courseRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/attendance", attendanceRoutes);

// Sadeepa Endpoints
app.use("/api/assignments", assignmentRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/projects", projectRoutes);

// Lasiru Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/enrollments", enrollmentRoutes);

// Jeewani Endpoints
app.use("/api/jeewani/courses", jeewaniCourseRoutes);
app.use("/api/jeewani/reviews", jeewaniReviewRoutes);

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://itpmsliit:ItpmSliit2026@itpm.fwhtwym.mongodb.net/ITPM_LMS?appName=ITPM";
const LOCAL_URI = process.env.LOCAL_MONGO_URI || "mongodb://127.0.0.1:27017/ITPM_LMS";
const PORT = process.env.PORT || 5000;

const connectWithFallback = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGO_URI, { 
      serverSelectionTimeoutMS: 5000 
    });
    console.log("MongoDB Atlas connected successfully");
  } catch (err) {
    console.error("MongoDB Atlas connection failed:", err.message);
    console.log("Falling back to local MongoDB...");
    try {
      await mongoose.connect(LOCAL_URI);
      console.log("Local MongoDB connected successfully");
    } catch (localErr) {
      console.error("CRITICAL: Local MongoDB connection also failed:", localErr.message);
      process.exit(1);
    }
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

connectWithFallback();
