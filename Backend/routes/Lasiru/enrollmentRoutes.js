const express = require("express");
const { enrollInCourse, getStudentCourses } = require("../../Controllers/Lasiru/enrollmentController");

const router = express.Router();

// Enroll in a course
router.post("/enroll", enrollInCourse);

// Get student's enrolled courses
router.get("/student/:studentId", getStudentCourses);

// Get students enrolled in a course
router.get("/course/:courseId/students", require("../../Controllers/Lasiru/enrollmentController").getCourseStudents);

module.exports = router;
