const express = require("express");
const { enrollInCourse, getStudentCourses } = require("../../Controllers/Lasiru/enrollmentController.js");

const router = express.Router();

// Enroll in a course
router.post("/enroll", enrollInCourse);

// Get student's enrolled courses
router.get("/student/:studentId", getStudentCourses);

module.exports = router;
