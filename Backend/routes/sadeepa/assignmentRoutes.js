import express from 'express';
import { 
  createAssignment, 
  getReports, 
  getAssignmentsForStudent, 
  getAssignmentById, 
  submitAssignment,
  updateSubmissionGrade
} from '../../Controllers/sadeepa/assignmentController.js';

const router = express.Router();

router.post('/create', createAssignment);
router.get('/reports', getReports);

router.get('/student', getAssignmentsForStudent);
router.get('/:id', getAssignmentById);
router.post('/submit', submitAssignment);
router.put('/submissions/:id/grade', updateSubmissionGrade);

export default router;
