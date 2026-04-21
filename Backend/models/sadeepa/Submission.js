const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'sadeepa_Assignment', required: true },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId },
    answerText: { type: String } // Chosen MCQ option or Essay text response
  }],
  marks: { type: Number, default: 0 },
  grade: { type: String, default: 'Pending' },
  status: { type: String, enum: ['Submitted', 'Graded'], default: 'Submitted' }
}, { timestamps: true });

// Prevent duplicate submissions per student per assignment
submissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.models.sadeepa_Submission || mongoose.model('sadeepa_Submission', submissionSchema);
