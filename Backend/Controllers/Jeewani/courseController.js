import Course from "../../models/Jeewani/Course.js";
import fs from 'fs';
import path from 'path';

// Create a new course
export const createCourse = async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
};

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

// Get course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
};

// Update course
export const updateCourse = async (req, res) => {
  try {
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};

// Add module to course
export const addModule = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    const newModule = { title: req.body.title, lessons: [] };
    course.modules.push(newModule);
    await Course.updateOne({ _id: course._id }, { $push: { modules: newModule }, $set: { updatedAt: new Date() } });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error adding module', error: error.message });
  }
};

// Delete module from course
export const deleteModule = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
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
export const updateModule = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
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
export const addLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
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

    // If file was uploaded via multer
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
export const deleteLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
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
export const updateLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
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

    // If a new file was uploaded, delete the old one and update
    if (req.file) {
      // Remove old file if it exists and wasn't a remote URL
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
