import express from "express";
import {
    getAllReviews,
    deleteReview,
    updateReviewStatus,
} from "../../Controllers/Lasiru/reviewController.js";
import { authenticate, authorizeRoles } from "../../middleware/Lasiru/authMiddleware.js";

const router = express.Router();

// Public routes (if any)
// router.get("/", getAllPublishedReviews);

// Protected routes (Admin only)
router.use(authenticate);
router.use(authorizeRoles("Admin"));

router.get("/all", getAllReviews);
router.delete("/delete/:id", deleteReview);
router.patch("/status/:id", updateReviewStatus);

export default router;
