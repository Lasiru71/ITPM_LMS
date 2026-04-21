const express = require("express");
const {
    getAllLecturers,
    createLecturer,
    deleteLecturer,
    getAllStudents,
    deleteStudent,
    toggleUserStatus,
    getDashboardStats,
    updateUser,
} = require("../../Controllers/Lasiru/adminController");
const { authenticate, authorizeRoles } = require("../../middleware/Lasiru/authMiddleware");

const router = express.Router();

// All routes are protected and require admin role
router.use(authenticate);
router.use(authorizeRoles("Admin"));

// Lecturer routes
router.get("/lecturers", getAllLecturers);
router.post("/lecturers", createLecturer);
router.delete("/lecturers/:id", deleteLecturer);

// Student routes
router.get("/students", getAllStudents);
router.delete("/students/:id", deleteStudent);

// Toggle status for any user
router.patch("/users/:id/toggle", toggleUserStatus);

// Edit User Profiles
router.put("/users/:id", updateUser);

// Dashboard Stats
router.get("/stats", getDashboardStats);

module.exports = router;
