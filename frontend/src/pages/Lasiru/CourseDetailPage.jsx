import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, PlusCircle, Video, FileText, HelpCircle, FilePlus, Trash2, Edit } from "lucide-react";
import DashboardHeader from "../../components/Lasiru/DashboardHeader";
import { useToast } from "../../components/Lasiru/ToastProvider";

import "../../Styles/Lasiru/CourseDetailPage.css";

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("modules");
  
  // State for Add Module
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  
  // State for Add Lesson
  const [addingLessonTo, setAddingLessonTo] = useState(null);
  const [newLesson, setNewLesson] = useState({ title: "", type: "video", duration: "10m" });

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
      setCourse(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching course:", error);
      showToast("error", "Failed to load course details.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const updateCourseBackend = async (updatedCourseData) => {
    try {
      await axios.put(`http://localhost:5000/api/courses/${courseId}`, updatedCourseData);
      setCourse(updatedCourseData);
      showToast("success", "Course updated successfully!");
    } catch (error) {
      console.error("Error updating course:", error);
      showToast("error", "Failed to update course.");
      fetchCourse(); // Revert to original state on fail
    }
  };

  const handleAddModule = () => {
    if (!newModuleTitle.trim()) return;
    const updatedCourse = { ...course };
    if (!updatedCourse.modules) updatedCourse.modules = [];
    
    updatedCourse.modules.push({ title: newModuleTitle, lessons: [] });
    setNewModuleTitle("");
    setIsAddingModule(false);
    updateCourseBackend(updatedCourse);
  };

  const handleDeleteModule = (moduleIndex) => {
    const updatedCourse = { ...course };
    updatedCourse.modules.splice(moduleIndex, 1);
    updateCourseBackend(updatedCourse);
  };

  const handleAddLesson = (moduleIndex) => {
    if (!newLesson.title.trim()) return;
    const updatedCourse = { ...course };
    updatedCourse.modules[moduleIndex].lessons.push({ ...newLesson });
    setNewLesson({ title: "", type: "video", duration: "10m" });
    setAddingLessonTo(null);
    updateCourseBackend(updatedCourse);
  };

  const handleDeleteLesson = (moduleIndex, lessonIndex) => {
    const updatedCourse = { ...course };
    updatedCourse.modules[moduleIndex].lessons.splice(lessonIndex, 1);
    updateCourseBackend(updatedCourse);
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'video': return <Video size={18} />;
      case 'text': return <FileText size={18} />;
      case 'quiz': return <HelpCircle size={18} />;
      case 'assignment': return <FilePlus size={18} />;
      default: return <Video size={18} />;
    }
  };

  if (loading) return <div className="loading-state">Loading course details...</div>;
  if (!course) return <div className="error-state">Course not found.</div>;

  return (
    <div className="course-detail-page">
      <DashboardHeader title="Lecture Material Management" />
      
      <div className="course-detail-container">
        <button className="btn-secondary" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => navigate(-1)}>
          <ChevronLeft size={18} /> Back to Dashboard
        </button>

        <div className="course-header">
          <img src={course.thumbnail} alt={course.title} className="course-thumbnail" />
          <div className="course-info">
            <h1>{course.title}</h1>
            <p>{course.description}</p>
            <div className="course-meta">
              <div className="meta-item price">${course.price}</div>
              <div className="meta-item">Level: {course.level || 'Beginner'}</div>
              <div className="meta-item">Category: {course.category}</div>
            </div>
            <div className="action-buttons">
              <button className="btn-primary">Edit Course Info</button>
            </div>
          </div>
        </div>

        <div className="course-tabs">
          <button className={`tab-btn ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>Overview</button>
          <button className={`tab-btn ${activeTab === "modules" ? "active" : ""}`} onClick={() => setActiveTab("modules")}>Modules</button>
          <button className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`} onClick={() => setActiveTab("reviews")}>Reviews</button>
        </div>

        {activeTab === "modules" && (
          <div className="modules-section">
            <div className="modules-header">
              <h2>Course Content</h2>
              {!isAddingModule && (
                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setIsAddingModule(true)}>
                  <PlusCircle size={18} /> Add Module
                </button>
              )}
            </div>

            {isAddingModule && (
              <div className="add-form" style={{ marginBottom: '2rem', background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>
                <input 
                  type="text" 
                  placeholder="Module Title (e.g. Section 1: Introduction)" 
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                />
                <button className="btn-primary" onClick={handleAddModule}>Save Module</button>
                <button className="btn-secondary" onClick={() => setIsAddingModule(false)}>Cancel</button>
              </div>
            )}

            {(!course.modules || course.modules.length === 0) ? (
              <div className="text-center p-8 text-gray-500">No modules added yet. Click "Add Module" to start building your course.</div>
            ) : (
              course.modules.map((module, mIndex) => (
                <div key={mIndex} className="module-card">
                  <div className="module-header">
                    <h3>{module.title}</h3>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem' }} onClick={() => setAddingLessonTo(addingLessonTo === mIndex ? null : mIndex)}>
                        {addingLessonTo === mIndex ? 'Cancel Lesson' : '+ Add Lesson'}
                      </button>
                      <button className="btn-danger" onClick={() => handleDeleteModule(mIndex)}><Trash2 size={16} /></button>
                    </div>
                  </div>

                  <div className="lessons-list">
                    {module.lessons && module.lessons.length > 0 ? (
                      module.lessons.map((lesson, lIndex) => (
                        <div key={lIndex} className="lesson-item">
                          <div className="lesson-info">
                            <span className="lesson-icon">{getLessonIcon(lesson.type)}</span>
                            <span className="lesson-title">{lesson.title}</span>
                          </div>
                          <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
                            <span className="lesson-meta">{lesson.duration || '10m'}</span>
                            <button className="btn-secondary" style={{background:'transparent', padding:'0.2rem'}} onClick={() => handleDeleteLesson(mIndex, lIndex)}>
                              <Trash2 size={16} color="#e03131" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{color: '#888', padding: '1rem 0'}}>No lessons in this module yet.</div>
                    )}
                  </div>

                  {addingLessonTo === mIndex && (
                    <div className="add-lesson-area">
                      <div className="add-form">
                        <select 
                          value={newLesson.type} 
                          onChange={(e) => setNewLesson({...newLesson, type: e.target.value})}
                        >
                          <option value="video">Video</option>
                          <option value="text">Text Document</option>
                          <option value="quiz">Quiz</option>
                          <option value="assignment">Assignment</option>
                        </select>
                        <input 
                          type="text" 
                          placeholder="Lesson Title" 
                          value={newLesson.title}
                          onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                        />
                        <button className="btn-primary" onClick={() => handleAddLesson(mIndex)}>Add</button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "overview" && (
          <div className="modules-section">
            <h2>Course Overview</h2>
            <p>{course.description}</p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="modules-section">
            <h2>Student Reviews</h2>
            <p style={{ color: '#888' }}>Reviews will appear here once students start rating your course.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;
