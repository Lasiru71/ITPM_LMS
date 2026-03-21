import express from 'express';
const router = express.Router();
import * as courseController from '../../Controllers/Jeewani/courseController.js';

router.post('/', courseController.createCourse);
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

export default router;
