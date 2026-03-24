import Enrollment from "../../models/Lasiru/Enrollment.js";
import Course from "../../models/Jeewani/Course.js";

// Enroll a student in a course
export const enrollInCourse = async (req, res) => {
  try {
    const { studentId, courseId, paymentAmount } = req.body;

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ studentId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    const newEnrollment = new Enrollment({
      studentId,
      courseId,
      paymentAmount,
      paymentStatus: "Completed", // Assuming payment is done on frontend or via a gateway
    });

    await newEnrollment.save();
    res.status(201).json({ message: "Enrolled successfully", enrollment: newEnrollment });
  } catch (error) {
    res.status(500).json({ message: "Error enrolling in course", error: error.message });
  }
};

// Get all courses for a specific student
export const getStudentCourses = async (req, res) => {
  try {
    const { studentId } = req.params;
    const enrollments = await Enrollment.find({ studentId }).populate("courseId");
    
    // Extract the courses from enrollments
    const courses = enrollments
      .filter(e => e.courseId) // Filter out any broken references
      .map(e => ({
        ...e.courseId._doc,
        enrollmentId: e._id,
        paymentStatus: e.paymentStatus,
        enrolledAt: e.createdAt
      }));

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student courses", error: error.message });
  }
};
