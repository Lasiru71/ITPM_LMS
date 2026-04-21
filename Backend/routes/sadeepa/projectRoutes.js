const express = require('express');
const { 
  uploadProject, 
  getAllProjects, 
  incrementViews, 
  incrementDownloads,
  deleteProject 
} = require('../../Controllers/sadeepa/projectController.js');

const router = express.Router();

router.post('/upload', uploadProject);
router.get('/', getAllProjects);
router.patch('/:id/view', incrementViews);
router.patch('/:id/download', incrementDownloads);
router.delete('/:id', deleteProject);

module.exports = router;
