const crypto = require('crypto');
const AttendanceSession = require('../models/AttendanceSession');
const AttendanceRecord = require('../models/AttendanceRecord');

exports.generateQRSession = async (req, res) => {
  try {
    const { courseId, lecturerId } = req.body;

    const token = crypto.randomBytes(16).toString('hex');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000);

    const session = await AttendanceSession.create({
      course: courseId,
      lecturerId,
      qrToken: token,
      sessionDate: now,
      expiresAt,
    });

    res.status(201).json({
      message: 'QR session created',
      session,
      qrToken: token,
      validUntil: expiresAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.markAttendanceByQR = async (req, res) => {
  try {
    const { studentId, token } = req.body;

    const session = await AttendanceSession.findOne({ qrToken: token });

    if (!session) {
      return res.status(404).json({ message: 'Invalid QR token' });
    }

    if (new Date() > new Date(session.expiresAt)) {
      return res.status(400).json({ message: 'QR token expired' });
    }

    const alreadyMarked = await AttendanceRecord.findOne({
      session: session._id,
      studentId,
    });

    if (alreadyMarked) {
      return res.status(400).json({ message: 'Attendance already marked' });
    }

    const record = await AttendanceRecord.create({
      session: session._id,
      course: session.course,
      studentId,
      status: 'PRESENT',
    });

    res.status(201).json({
      message: 'Attendance marked successfully',
      record,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAttendanceByCourse = async (req, res) => {
  try {
    const records = await AttendanceRecord.find({ course: req.params.courseId })
      .populate('course')
      .populate('session');

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentMonthlyAttendance = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    const records = await AttendanceRecord.find({
      studentId,
      course: courseId,
    });

    const sessions = await AttendanceSession.find({
      course: courseId,
    });

    const totalSessions = sessions.length;
    const attendedSessions = records.length;

    const percentage =
      totalSessions === 0 ? 0 : ((attendedSessions / totalSessions) * 100).toFixed(2);

    res.json({
      studentId,
      courseId,
      totalSessions,
      attendedSessions,
      percentage,
      warning: Number(percentage) < 75 ? 'LOW_ATTENDANCE' : 'OK',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};