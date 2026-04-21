const crypto = require('crypto');
const AttendanceSession = require('../models/AttendanceSession');
const AttendanceRecord = require('../models/AttendanceRecord');
const Course = require('../models/Course');

exports.generateQRSession = async (req, res) => {
  try {
    const { courseId, lecturerId } = req.body;

    if (!courseId || !lecturerId) {
      return res.status(400).json({ message: 'Course ID and lecturer ID are required' });
    }

    if (!/^LEC\d{3,}$/.test(lecturerId)) {
      return res.status(400).json({ message: 'Invalid lecturer ID format' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const token = crypto.randomBytes(16).toString('hex');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000);

    const session = await AttendanceSession.create({
      course: courseId,
      lecturerId,
      sessionDate: now,
      qrToken: token,
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

    if (!studentId || !token) {
      return res.status(400).json({ message: 'Student ID and token are required' });
    }

    if (!/^IT\d{4,}$/.test(studentId)) {
      return res.status(400).json({ message: 'Invalid student ID format' });
    }

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
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const records = await AttendanceRecord.find({ course: req.params.courseId })
      .populate('course')
      .populate('session');

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSessionsByCourse = async (req, res) => {
  try {
    const sessions = await AttendanceSession.find({ course: req.params.courseId })
      .sort({ sessionDate: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAttendanceBySession = async (req, res) => {
  try {
    const records = await AttendanceRecord.find({ session: req.params.sessionId });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSessionAttendance = async (req, res) => {
  try {
    const { sessionId, records } = req.body; // records: [{ studentId, status }]

    if (!sessionId || !records) {
      return res.status(400).json({ message: 'Session ID and records are required' });
    }

    const session = await AttendanceSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Bulk update approach
    for (const rec of records) {
      await AttendanceRecord.findOneAndUpdate(
        { session: sessionId, studentId: rec.studentId },
        { 
          status: rec.status, 
          course: session.course,
          session: sessionId,
          studentId: rec.studentId 
        },
        { upsert: true, new: true }
      );
    }

    res.json({ message: 'Attendance updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentMonthlyAttendance = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    if (!/^IT\d{4,}$/.test(studentId)) {
      return res.status(400).json({ message: 'Invalid student ID format' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

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
      warning: Number(percentage) < 80,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};