const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const paymentRoutes = require("./routes/payment.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const courseRoutes = require("./routes/course.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/courses", courseRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/attendance", attendanceRoutes);

mongoose.connect("mongodb+srv://itpmsliit:ItpmSliit2026@itpm.fwhtwym.mongodb.net/ITPM_LMS?appName=ITPM")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });