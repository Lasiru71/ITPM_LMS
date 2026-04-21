const express = require('express');
const { 
  uploadMaterial, 
  getAllMaterials, 
  deleteMaterial 
} = require('../../Controllers/sadeepa/materialController');

const router = express.Router();

router.post('/upload', uploadMaterial);
router.get('/', getAllMaterials);
router.delete('/:id', deleteMaterial);

module.exports = router;
