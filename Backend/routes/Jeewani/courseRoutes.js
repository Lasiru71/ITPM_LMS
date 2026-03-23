import express from 'express';
const router = express.Router();
import * as courseController from '../../Controllers/Jeewani/courseController.js';

// Course CRUD
router.post('/', courseController.createCourse);
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

// Module management
router.post('/:id/modules', courseController.addModule);
router.put('/:id/modules/:moduleIndex', courseController.updateModule);
router.delete('/:id/modules/:moduleIndex', courseController.deleteModule);

// Lesson management
router.post('/:id/modules/:moduleIndex/lessons', courseController.addLesson);
router.put('/:id/modules/:moduleIndex/lessons/:lessonIndex', courseController.updateLesson);
router.delete('/:id/modules/:moduleIndex/lessons/:lessonIndex', courseController.deleteLesson);

export default router;
