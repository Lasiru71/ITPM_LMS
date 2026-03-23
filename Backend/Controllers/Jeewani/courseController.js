import Course from "../../models/Jeewani/Course.js";

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
    
    course.modules.push({ title: req.body.title, lessons: [] });
    course.updatedAt = new Date();
    await course.save();
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
    
    course.modules.splice(moduleIndex, 1);
    course.updatedAt = new Date();
    await course.save();
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
    course.updatedAt = new Date();
    await course.save();
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
    
    course.modules[moduleIndex].lessons.push({
      title: req.body.title,
      type: req.body.type || 'video',
      duration: req.body.duration || '10m',
      content: req.body.content || '',
      isPreview: req.body.isPreview || false
    });
    course.updatedAt = new Date();
    await course.save();
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
    
    course.modules[moduleIndex].lessons.splice(lessonIndex, 1);
    course.updatedAt = new Date();
    await course.save();
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
    if (req.body.type) lesson.type = req.body.type;
    if (req.body.duration) lesson.duration = req.body.duration;
    if (req.body.content !== undefined) lesson.content = req.body.content;
    if (req.body.isPreview !== undefined) lesson.isPreview = req.body.isPreview;
    
    course.updatedAt = new Date();
    await course.save();
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error updating lesson', error: error.message });
  }
};
