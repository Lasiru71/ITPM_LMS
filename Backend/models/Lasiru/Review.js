const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: false, // temporarily false to not break existing data
    },
    courseName: {
      type: String,
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Approved",
    },
    adminReply: {
      type: String,
      default: "",
    },
    repliedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const ReviewValue = mongoose.models.ReviewLasiru || mongoose.model("ReviewLasiru", reviewSchema);
module.exports = ReviewValue;
