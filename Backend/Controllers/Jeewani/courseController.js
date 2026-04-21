const Course = require("../../models/Jeewani/Course");
const fs = require('fs');
const path = require('path');

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    // Force instructorId to be the logged in user
    const courseData = {
      ...req.body,
      instructorId: req.user._id,
      instructor: req.user.name,
      instructorAvatar: req.user.avatar,
      instructorBio: req.user.bio || 'Instructor on EduVault'
    };
    
    const newCourse = new Course(courseData);
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

// Get courses by lecturer
exports.getCoursesByLecturer = async (req, res) => {
  try {
    const courses = await Course.find({ instructorId: req.params.lecturerId });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lecturer courses', error: error.message });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Check ownership
    if (String(course.instructorId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden: You do not own this course' });
    }

    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Check ownership
    if (String(course.instructorId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden: You do not own this course' });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};


// Add module to course
exports.addModule = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    // Check ownership
    if (String(course.instructorId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden: You do not own this course' });
    }

    const newModule = { title: req.body.title, lessons: [] };
    course.modules.push(newModule);
    await Course.updateOne({ _id: course._id }, { $push: { modules: newModule }, $set: { updatedAt: new Date() } });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error adding module', error: error.message });
  }
};

// Delete module from course
exports.deleteModule = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    // Check ownership
    if (String(course.instructorId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden: You do not own this course' });
    }

    const moduleIndex = parseInt(req.params.moduleIndex);
    if (moduleIndex < 0 || moduleIndex >= course.modules.length) {
      return res.status(400).json({ message: 'Invalid module index' });
    }
    
    const modules = course.modules.toObject();
    modules.splice(moduleIndex, 1);
    course.modules = modules;
    await Course.updateOne({ _id: course._id }, { $set: { modules, updatedAt: new Date() } });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting module', error: error.message });
  }
};

// Update module title
exports.updateModuleTitle = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    // Check ownership
    if (String(course.instructorId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden: You do not own this course' });
    }

    const moduleIndex = parseInt(req.params.moduleIndex);
    if (moduleIndex < 0 || moduleIndex >= course.modules.length) {
      return res.status(400).json({ message: 'Invalid module index' });
    }
    
    course.modules[moduleIndex].title = req.body.title;
    await Course.updateOne({ _id: course._id }, { $set: { [`modules.${moduleIndex}.title`]: req.body.title, updatedAt: new Date() } });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error updating module', error: error.message });
  }
};

// Add lesson to module
exports.addLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    // Check ownership
    if (String(course.instructorId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden: You do not own this course' });
    }

    const moduleIndex = parseInt(req.params.moduleIndex);
    if (moduleIndex < 0 || moduleIndex >= course.modules.length) {
      return res.status(400).json({ message: 'Invalid module index' });
    }
    
    const lessonData = {
      title: req.body.title,
      type: req.body.type || 'video',
      duration: (req.body.type || 'video') === 'video' ? (req.body.duration || '10m') : '',
      content: req.body.content || '',
      isPreview: req.body.isPreview || false,
      description: req.body.description || '',
      deadline: req.body.deadline || null,
      publishDate: req.body.publishDate || null
    };

    if (req.body.fileUrl) {
      lessonData.fileUrl = req.body.fileUrl;
    }

    if (req.file) {
      lessonData.fileUrl = `/uploads/lessons/${req.file.filename}`;
    }

    course.modules[moduleIndex].lessons.push(lessonData);
    await Course.updateOne({ _id: course._id }, { $push: { [`modules.${moduleIndex}.lessons`]: lessonData }, $set: { updatedAt: new Date() } });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error adding lesson', error: error.message });
  }
};

// Delete lesson from module
exports.deleteLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    // Check ownership
    if (String(course.instructorId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden: You do not own this course' });
    }

    const moduleIndex = parseInt(req.params.moduleIndex);
    const lessonIndex = parseInt(req.params.lessonIndex);
    
    if (moduleIndex < 0 || moduleIndex >= course.modules.length) {
      return res.status(400).json({ message: 'Invalid module index' });
    }
    if (lessonIndex < 0 || lessonIndex >= course.modules[moduleIndex].lessons.length) {
      return res.status(400).json({ message: 'Invalid lesson index' });
    }
    
    const lessons = course.modules[moduleIndex].lessons.toObject();
    lessons.splice(lessonIndex, 1);
    course.modules[moduleIndex].lessons = lessons;
    await Course.updateOne({ _id: course._id }, { $set: { [`modules.${moduleIndex}.lessons`]: lessons, updatedAt: new Date() } });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lesson', error: error.message });
  }
};

// Update lesson
exports.updateLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    // Check ownership
    if (String(course.instructorId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden: You do not own this course' });
    }

    const moduleIndex = parseInt(req.params.moduleIndex);
    const lessonIndex = parseInt(req.params.lessonIndex);
    
    if (moduleIndex < 0 || moduleIndex >= course.modules.length) {
      return res.status(400).json({ message: 'Invalid module index' });
    }
    if (lessonIndex < 0 || lessonIndex >= course.modules[moduleIndex].lessons.length) {
      return res.status(400).json({ message: 'Invalid lesson index' });
    }
    
    const lesson = course.modules[moduleIndex].lessons[lessonIndex];
    if (req.body.title) lesson.title = req.body.title;
    if (req.body.type) {
      lesson.type = req.body.type;
      if (lesson.type !== 'video') {
        lesson.duration = '';
      }
    }
    if (req.body.duration && (req.body.type === 'video' || lesson.type === 'video')) {
      lesson.duration = req.body.duration;
    }
    if (req.body.content !== undefined) lesson.content = req.body.content;
    if (req.body.isPreview !== undefined) lesson.isPreview = req.body.isPreview;
    if (req.body.description !== undefined) lesson.description = req.body.description;
    if (req.body.deadline !== undefined) lesson.deadline = req.body.deadline;
    if (req.body.publishDate !== undefined) lesson.publishDate = req.body.publishDate;

    if (req.body.fileUrl) {
      lesson.fileUrl = req.body.fileUrl;
    }

    if (req.file) {
      if (lesson.fileUrl && !lesson.fileUrl.startsWith('http')) {
        const relativePath = lesson.fileUrl.startsWith('/') ? lesson.fileUrl.substring(1) : lesson.fileUrl;
        const oldPath = path.join(process.cwd(), relativePath);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      lesson.fileUrl = `/uploads/lessons/${req.file.filename}`;
    }
    
    const updatedLesson = lesson.toObject ? lesson.toObject() : lesson;
    await Course.updateOne(
      { _id: course._id },
      { $set: { [`modules.${moduleIndex}.lessons.${lessonIndex}`]: updatedLesson, updatedAt: new Date() } }
    );
    res.status(200).json(course);
  } catch (error) {
    console.error('UpdateLesson Error:', error);
    res.status(500).json({ message: 'Error updating lesson', error: error.message });
  }
};

