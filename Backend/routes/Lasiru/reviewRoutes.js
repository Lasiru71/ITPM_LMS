const express = require("express");
const {
    createReview,
    getAllReviews,
    getStudentReviews,
    addAdminReply,
    deleteReview,
    updateReviewStatus,
} = require("../../Controllers/Lasiru/reviewController.js");
const { authenticate, authorizeRoles } = require("../../middleware/Lasiru/authMiddleware.js");

const router = express.Router();

// All review routes require authentication
router.use(authenticate);

// Student routes
router.post("/", createReview);
router.get("/my-reviews", getStudentReviews);

// Admin & Lecturer routes
router.get("/all", authorizeRoles("Admin", "Lecturer"), getAllReviews);
router.patch("/reply/:id", authorizeRoles("Admin"), addAdminReply);
// Admin & Student delete route (Security handled in controller)
router.delete("/delete/:id", deleteReview);
router.patch("/status/:id", authorizeRoles("Admin"), updateReviewStatus);

module.exports = router;
