import Review from "../../models/Lasiru/Review.js";
import User from "../../models/Lasiru/User.js";
import Course from "../../models/Jeewani/Course.js";

// Get all reviews with course and student details
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate("courseId", "title")
            .populate("studentId", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Error fetching reviews", error: error.message });
    }
};

// Delete a review
export const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedReview = await Review.findByIdAndDelete(id);
        
        if (!deletedReview) {
            return res.status(404).json({ message: "Review not found" });
        }
        
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting review", error: error.message });
    }
};

// Update review status (Approved/Rejected)
export const updateReviewStatus = async (req, res) => {
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
