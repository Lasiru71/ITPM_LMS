import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    paymentAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Completed", "Pending", "Failed"],
      default: "Completed",
    },
  },
  { timestamps: true }
);

// To prevent duplicate enrollments
enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment;
