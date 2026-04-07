import express from "express";
import {
    getAllLecturers,
    createLecturer,
    deleteLecturer,
    getAllStudents,
    deleteStudent,
    toggleUserStatus,
    getDashboardStats,
} from "../../controllers/Lasiru/adminController.js";
import { authenticate, authorizeRoles } from "../../middleware/Lasiru/authMiddleware.js";

const router = express.Router();

// All routes are protected
router.use(authenticate);

// Lecturer routes
router.get("/lecturers", authorizeRoles("Admin"), getAllLecturers);
router.post("/lecturers", authorizeRoles("Admin"), createLecturer);
router.delete("/lecturers/:id", authorizeRoles("Admin"), deleteLecturer);

// Student routes (Lecturers also need to be able to see students for attendance)
router.get("/students", authorizeRoles("Admin", "Lecturer"), getAllStudents);
router.delete("/students/:id", authorizeRoles("Admin"), deleteStudent);

// Toggle status for any user
router.patch("/users/:id/toggle", authorizeRoles("Admin"), toggleUserStatus);

// Dashboard Stats
router.get("/stats", authorizeRoles("Admin"), getDashboardStats);

export default router;
