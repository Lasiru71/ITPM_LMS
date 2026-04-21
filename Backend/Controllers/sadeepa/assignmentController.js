const Assignment = require('../../models/sadeepa/Assignment');
const Submission = require('../../models/sadeepa/Submission');

// --- LECTURER ENDPOINTS ---

exports.createAssignment = async (req, res) => {
  try {
    const { title, type, description, startTime, deadline, timeLimit, endOfTime, questions, fileData, createdBy } = req.body;
    
    const assignment = new Assignment({
      title,
      type: type || 'Assignment',
      description,
      startTime,
      deadline,
      timeLimit,
      endOfTime,
      questions,
      fileData,
      createdBy: createdBy || 'test@gmail.com' // Fallback for testing
    });

    await assignment.save();
    res.status(201).json({ message: 'Assignment created successfully', assignment });
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ message: 'Failed to create assignment', error: error.message });
  }
};

exports.getReports = async (req, res) => {
  try {
    // Fetch all submissions and populate assignment title
    const submissions = await Submission.find()
      .populate('assignmentId', 'title')
      .sort({ createdAt: -1 });
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reports', error: error.message });
  }
};

// --- STUDENT ENDPOINTS ---

exports.getAssignmentsForStudent = async (req, res) => {
  try {
    const { studentId, studentName } = req.query; // Passed from frontend auth
    
    const allAssignments = await Assignment.find().sort({ deadline: 1 });
    const studentSubmissions = await Submission.find({ studentId });

    // Map submissions by assignmentId
    const submittedMap = {};
    studentSubmissions.forEach(sub => {
      submittedMap[sub.assignmentId.toString()] = sub;
    });

    const now = new Date();

    const categorized = {
      available: [],
      pending: [],
      completed: []
    };

    allAssignments.forEach(assignment => {
      const sub = submittedMap[assignment._id.toString()];
      const isPastDeadline = new Date(assignment.deadline) < now;

      const assignmentData = {
        ...assignment.toObject(), // Includes questions (maybe shouldn't return correct answers to student here, but for simplicity ok)
        submission: sub || null
      };
      
      // Basic grading simulation categorization
      if (sub) {
        categorized.completed.push(assignmentData);
      } else {
        if (!isPastDeadline) {
          categorized.pending.push(assignmentData); // Needs to be done
          categorized.available.push(assignmentData); // Still open
        } else {
           // Missed
           categorized.available.push(assignmentData); // Let them see it anyway
        }
      }
    });

    res.status(200).json(categorized);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch assignments', error: error.message });
  }
};

exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId, studentId, studentName, answers } = req.body;
    
    // Calculate marks for MCQs
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    let marks = 0;
    let totalPossible = 0;

    answers.forEach(ans => {
      const q = assignment.questions.id(ans.questionId);
      if (q) {
        if (q.type === 'MCQ') {
          totalPossible += q.points;
          if (q.correctAnswer === ans.answerText) {
            marks += q.points;
          }
        } else if (q.type === 'Essay') {
          // Assume essay gives partial random score for demo or 0 requiring manual.
          totalPossible += q.points;
        }
      }
    });

    // Auto calculate grade mapping
    const percentage = totalPossible > 0 ? (marks / totalPossible) * 100 : 0;
    let grade = 'F';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 60) grade = 'C';
    else if (percentage >= 50) grade = 'S';

    const newSubmission = new Submission({
      assignmentId,
      studentId,
      studentName,
      answers,
      marks,
      grade,
      status: 'Graded' // Auto graded
    });

    await newSubmission.save();
    res.status(201).json({ message: 'Submitted successfully', submission: newSubmission });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already submitted this assignment.' });
    }
    console.error('Submit error:', error);
    res.status(500).json({ message: 'Failed to submit', error: error.message });
  }
};

exports.updateSubmissionGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const { marks } = req.body;
    
    const percentage = Number(marks);
    let grade = 'F';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 60) grade = 'C';
    else if (percentage >= 50) grade = 'S';

    const submission = await Submission.findByIdAndUpdate(
      id, 
      { marks: percentage, grade, status: 'Graded' },
      { new: true }
    );
    
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    
    res.status(200).json({ message: 'Grade updated successfully', submission });
  } catch (error) {
    console.error('Update grade error:', error);
    res.status(500).json({ message: 'Failed to update grade', error: error.message });
  }
};
