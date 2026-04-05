import express from "express";
import {
    createReview,
    getAllReviews,
    getStudentReviews,
    addAdminReply,
    deleteReview,
    updateReviewStatus,
} from "../../Controllers/Lasiru/reviewController.js";
import { authenticate, authorizeRoles } from "../../middleware/Lasiru/authMiddleware.js";

const router = express.Router();

// All review routes require authentication
router.use(authenticate);

// Student routes
router.post("/", createReview);
router.get("/my-reviews", getStudentReviews);

// Admin only routes
router.get("/all", authorizeRoles("Admin"), getAllReviews);
router.patch("/reply/:id", authorizeRoles("Admin"), addAdminReply);
router.delete("/delete/:id", authorizeRoles("Admin"), deleteReview);
router.patch("/status/:id", authorizeRoles("Admin"), updateReviewStatus);

export default router;
