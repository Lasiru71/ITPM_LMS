const Review = require("../../models/Lasiru/Review.js");
const User = require("../../models/Lasiru/User.js");
const Course = require("../../models/Jeewani/Course.js");

// Create a new review (Student)
exports.createReview = async (req, res) => {
    try {
        const { courseId, courseName, rating, comment } = req.body;
        const studentId = req.user._id;

        const newReview = new Review({
            courseId,
            courseName,
            studentId,
            rating,
            comment
        });

        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).json({ message: "Error creating review", error: error.message });
    }
};

// Get all reviews with course and student details (Admin)
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate("studentId", "name email nicNumber")
            .sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reviews", error: error.message });
    }
};

// Get reviews for a specific student (Student Dashboard)
exports.getStudentReviews = async (req, res) => {
    try {
        const studentId = req.user._id;
        const reviews = await Review.find({ studentId })
            .sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Error fetching your reviews", error: error.message });
    }
};

// Add admin reply to a review
exports.addAdminReply = async (req, res) => {
    try {
        const { id } = req.params;
        const { adminReply } = req.body;

        const updatedReview = await Review.findByIdAndUpdate(
            id,
            { 
                adminReply,
                repliedAt: new Date(),
                status: "Approved" // Automatically approve if replied
            },
            { new: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.status(200).json(updatedReview);
    } catch (error) {
        res.status(500).json({ message: "Error adding admin reply", error: error.message });
    }
};

// Delete a review (Student can delete own, Admin can delete any)
exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const userRole = req.user.role;

        // 1. Find the review first to check ownership
        const review = await Review.findById(id);
        
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        // 2. Permission check: Admin or the student who wrote the review
        if (userRole !== "Admin" && review.studentId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You don't have permission to delete this review." });
        }

        // 3. Perform deletion
        await Review.findByIdAndDelete(id);
        
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error("Delete review error:", error.message);
        res.status(500).json({ message: "Error deleting review", error: error.message });
    }
};

// Update review status (Approved/Rejected)
exports.updateReviewStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const updatedReview = await Review.findByIdAndUpdate(id, { status }, { new: true });
        
        if (!updatedReview) {
            return res.status(404).json({ message: "Review not found" });
        }
        
        res.status(200).json(updatedReview);
    } catch (error) {
        res.status(500).json({ message: "Error updating review status", error: error.message });
    }
};
