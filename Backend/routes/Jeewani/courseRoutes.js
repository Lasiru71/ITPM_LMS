const express = require('express');
const router = express.Router();
const courseController = require('../../Controllers/Jeewani/courseController');
const upload = require('../../middleware/Jeewani/upload');
const { authenticate, authorizeRoles } = require('../../middleware/Lasiru/authMiddleware');

// Course CRUD
router.post('/', authenticate, authorizeRoles('Lecturer'), courseController.createCourse);
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.put('/:id', authenticate, authorizeRoles('Lecturer'), courseController.updateCourse);
router.delete('/:id', authenticate, authorizeRoles('Lecturer'), courseController.deleteCourse);

// Module management
router.post('/:id/modules', authenticate, authorizeRoles('Lecturer'), courseController.addModule);
router.put('/:id/modules/:moduleIndex', authenticate, authorizeRoles('Lecturer'), courseController.updateModuleTitle);
router.delete('/:id/modules/:moduleIndex', authenticate, authorizeRoles('Lecturer'), courseController.deleteModule);

// Lesson management (with file upload support)
router.post('/:id/modules/:moduleIndex/lessons', authenticate, authorizeRoles('Lecturer'), upload.single('file'), courseController.addLesson);
router.put('/:id/modules/:moduleIndex/lessons/:lessonIndex', authenticate, authorizeRoles('Lecturer'), upload.single('file'), courseController.updateLesson);
router.delete('/:id/modules/:moduleIndex/lessons/:lessonIndex', authenticate, authorizeRoles('Lecturer'), courseController.deleteLesson);

module.exports = router;
