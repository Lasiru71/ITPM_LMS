import express from "express";
import { enrollInCourse, getStudentCourses } from "../../controllers/Lasiru/enrollmentController.js";

const router = express.Router();

// Enroll in a course
router.post("/enroll", enrollInCourse);

// Get student's enrolled courses
router.get("/student/:studentId", getStudentCourses);

export default router;
