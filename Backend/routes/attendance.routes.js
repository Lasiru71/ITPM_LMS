const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');

router.post('/generate-qr', attendanceController.generateQRSession);
router.post('/scan', attendanceController.markAttendanceByQR);
router.get('/course/:courseId', attendanceController.getAttendanceByCourse);
router.get('/monthly/:studentId/:courseId', attendanceController.getStudentMonthlyAttendance);

module.exports = router;