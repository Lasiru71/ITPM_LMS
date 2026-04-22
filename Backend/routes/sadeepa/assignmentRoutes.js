const express = require('express');
const { 
  createAssignment, 
  getReports, 
  getAssignmentsForStudent, 
  getAssignmentById, 
  submitAssignment,
  updateSubmissionGrade
} = require('../../Controllers/sadeepa/assignmentController');

const router = express.Router();

router.post('/create', createAssignment);
router.get('/reports', getReports);

router.get('/student', getAssignmentsForStudent);
router.get('/:id', getAssignmentById);
router.post('/submit', submitAssignment);
router.put('/submissions/:id/grade', updateSubmissionGrade);

module.exports = router;
