const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ['Assignment', 'Exam'], default: 'Assignment' },
  description: { type: String },
  startTime: { type: Date }, // Start time for exams
  deadline: { type: Date }, // Optional for Exam
  endOfTime: { type: Date },
  timeLimit: { type: Number }, // For Exams: time in minutes
  questions: [{
    type: { type: String, enum: ['MCQ', 'Essay'], required: true },
    questionText: { type: String, required: true },
    options: [{ type: String }], // Only populated if type === 'MCQ'
    correctAnswer: { type: String }, // For MCQ, exactly matches one option
    points: { type: Number, default: 10 } // Default 10 points per question
  }],
  fileData: {
    filename: { type: String },
    base64: { type: String } // Storing file as base64 string directly in Mongo for portability
  },
  createdBy: { type: String, required: true } // Email or ID of the lecturer who created it
}, { timestamps: true });

module.exports = mongoose.models.sadeepa_Assignment || mongoose.model('sadeepa_Assignment', assignmentSchema);
