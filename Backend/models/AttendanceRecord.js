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
    enum: ['PRESENT'],
    default: 'PRESENT',
  },
}, { timestamps: true });

module.exports = mongoose.model('AttendanceRecord', attendanceRecordSchema);