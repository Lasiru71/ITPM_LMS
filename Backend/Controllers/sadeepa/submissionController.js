const Submission = require("../models/submissionModel");

// Submit assignment
const submitAssignment = async (req, res) => {
  try {
    const { assignmentId, studentId } = req.body;

    const submission = new Submission({
      assignmentId,
      studentId,
      file: req.file.filename,
    });

    const savedSubmission = await submission.save();

    res.status(201).json({
      message: "Assignment submitted successfully",
      data: savedSubmission,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get student submissions
const getStudentSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({
      studentId: req.params.studentId,
    }).populate("assignmentId");

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitAssignment,
  getStudentSubmissions,
};
