const express = require('express');
const router = express.Router();
const courseController = require('../../Controllers/Jeewani/courseController');
const upload = require('../../middleware/Jeewani/upload');

// Course CRUD
router.post('/', courseController.createCourse);
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

// Module management
router.post('/:id/modules', courseController.addModule);
router.put('/:id/modules/:moduleIndex', courseController.updateModuleTitle); // Fixed name to updateModuleTitle to match controller
router.delete('/:id/modules/:moduleIndex', courseController.deleteModule);

// Lesson management (with file upload support)
router.post('/:id/modules/:moduleIndex/lessons', upload.single('file'), courseController.addLesson);
router.put('/:id/modules/:moduleIndex/lessons/:lessonIndex', upload.single('file'), courseController.updateLesson);
router.delete('/:id/modules/:moduleIndex/lessons/:lessonIndex', courseController.deleteLesson);

module.exports = router;
