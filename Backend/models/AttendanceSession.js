const mongoose = require('mongoose');

const attendanceSessionSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  lecturerId: {
    type: String,
    required: true,
  },
  sessionDate: {
    type: Date,
    default: Date.now,
  },
  qrToken: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.models.AttendanceSession || mongoose.model('AttendanceSession', attendanceSessionSchema);