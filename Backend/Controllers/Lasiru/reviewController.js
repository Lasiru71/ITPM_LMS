const Review = require("../../models/Lasiru/Review");
const User = require("../../models/Lasiru/User");
const Course = require("../../models/Jeewani/Course");

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
            .populate("studentId", "name email studentId")
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

// Delete a review (Student can delete own, Admin/Lecturer can delete based on permissions)
exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const userRole = req.user.role;

        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        // Permission check
        let hasPermission = false;
        const currentUserId = String(userId);

        if (userRole === "Admin") {
            hasPermission = true;
        } else if (userRole === "Student" && String(review.studentId) === currentUserId) {
            hasPermission = true;
        } else if (userRole === "Lecturer") {
            // Check if this lecturer owns the course
            let course = null;
            
            // Try different ways to find the course
            if (review.courseId) {
                try {
                    // Try by ObjectId first
                    course = await Course.findById(review.courseId);
                    if (!course) {
                        // Try by custom id string
                        course = await Course.findOne({ id: review.courseId });
                    }
                } catch (e) {
                    // Fallback for non-ObjectId strings
                    course = await Course.findOne({ id: review.courseId });
                }
            }

            // Fallback: If no courseId in review, try finding by courseName
            if (!course && review.courseName) {
                course = await Course.findOne({ title: review.courseName });
            }

            if (course) {
                const isInstructor = 
                    String(course.instructorId) === currentUserId || 
                    String(course.instructor) === currentUserId ||
                    course.instructor === req.user.name; // Match by name as ultimate fallback
                
                if (isInstructor) {
                    hasPermission = true;
                }
            } else {
                // If we absolutely can't find the course, but the lecturer has already replied to it,
                // we can assume they have some authority over it.
                if (review.adminReply) {
                    hasPermission = true;
                }
            }
        }

        if (!hasPermission) {
            return res.status(403).json({ message: "You don't have permission to delete this review." });
        }

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
