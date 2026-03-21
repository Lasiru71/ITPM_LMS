import express from 'express';
import { 
  uploadProject, 
  getAllProjects, 
  incrementViews, 
  incrementDownloads,
  deleteProject 
} from '../../Controllers/sadeepa/projectController.js';

const router = express.Router();

router.post('/upload', uploadProject);
router.get('/', getAllProjects);
router.patch('/:id/view', incrementViews);
router.patch('/:id/download', incrementDownloads);
router.delete('/:id', deleteProject);

export default router;
