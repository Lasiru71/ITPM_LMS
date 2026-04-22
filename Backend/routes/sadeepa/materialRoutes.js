const express = require('express');
const { 
  uploadMaterial, 
  getAllMaterials, 
  deleteMaterial 
} = require('../../Controllers/sadeepa/materialController');
const { authenticate } = require('../../middleware/Lasiru/authMiddleware');

const router = express.Router();

router.post('/upload', authenticate, uploadMaterial);
router.get('/', authenticate, getAllMaterials);
router.delete('/:id', authenticate, deleteMaterial);

module.exports = router;

