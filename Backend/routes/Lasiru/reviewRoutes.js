const express = require("express");
const {
    createReview,
    getAllReviews,
    getStudentReviews,
    addAdminReply,
    deleteReview,
    updateReviewStatus,
} = require("../../Controllers/Lasiru/reviewController");
const { authenticate, authorizeRoles } = require("../../middleware/Lasiru/authMiddleware");

const router = express.Router();

// All review routes require authentication
router.use(authenticate);

// Student routes
router.post("/", createReview);
router.get("/my-reviews", getStudentReviews);

// Admin & Lecturer routes
router.get("/all", authorizeRoles("Admin", "Lecturer"), getAllReviews);
router.patch("/reply/:id", authorizeRoles("Admin", "Lecturer"), addAdminReply);
// Admin, Lecturer & Student delete route (Security handled in controller)
router.delete("/delete/:id", authorizeRoles("Admin", "Lecturer", "Student"), deleteReview);
router.patch("/status/:id", authorizeRoles("Admin"), updateReviewStatus);

module.exports = router;
