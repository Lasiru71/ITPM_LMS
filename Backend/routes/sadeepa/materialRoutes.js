import express from 'express';
import { 
  uploadMaterial, 
  getAllMaterials, 
  deleteMaterial 
} from '../../Controllers/sadeepa/materialController.js';

const router = express.Router();

router.post('/upload', uploadMaterial);
router.get('/', getAllMaterials);
router.delete('/:id', deleteMaterial);

export default router;
