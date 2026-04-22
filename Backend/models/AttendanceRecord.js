const mongoose = require('mongoose');

const attendanceRecordSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AttendanceSession',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  studentId: {
    type: String,
    required: true,
  },
  markedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['PRESENT', 'ABSENT', 'LATE'],
    default: 'PRESENT',
  },
}, { timestamps: true });

module.exports = mongoose.models.AttendanceRecord || mongoose.model('AttendanceRecord', attendanceRecordSchema);