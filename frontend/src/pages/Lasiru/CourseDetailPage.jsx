import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ChevronLeft,
  PlusCircle,
  Video,
  FileText,
  HelpCircle,
  FilePlus,
  Trash2,
  Edit,
  Layers,
  BookOpen,
  Clock,
  Check,
  X,
  GripVertical
} from "lucide-react";
import DashboardHeader from "../../components/Lasiru/DashboardHeader";
import { useToast } from "../../components/Lasiru/ToastProvider";

import "../../Styles/Lasiru/CourseDetailPage.css";

const API_BASE = "http://localhost:5000/api/courses";

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [user] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("modules");

  // State for Add Module
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");

  // State for editing module
  const [editingModuleIndex, setEditingModuleIndex] = useState(null);
  const [editModuleTitle, setEditModuleTitle] = useState("");

  // State for Add Lesson
  const [addingLessonTo, setAddingLessonTo] = useState(null);
  const [newLesson, setNewLesson] = useState({ title: "", type: "video", duration: "10m" });

  // State for editing lesson
  const [editingLesson, setEditingLesson] = useState(null); // { moduleIndex, lessonIndex }
  const [editLessonData, setEditLessonData] = useState({ title: "", type: "video", duration: "10m" });

  const fetchCourse = async () => {
    try {
      // Try localStorage first (for courses stored locally)
      const localCourses = JSON.parse(localStorage.getItem("courses") || "[]");
      const localCourse = localCourses.find(c => c._id === courseId);

      if (localCourse) {
        setCourse(localCourse);
        setLoading(false);
        return;
      }

      // Try backend API
      const response = await axios.get(`${API_BASE}/${courseId}`);
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

  // Helper to save course (works with both localStorage and API)
  const saveCourse = async (updatedCourse) => {
    setSaving(true);
    try {
      // Check if it's a local course
      const localCourses = JSON.parse(localStorage.getItem("courses") || "[]");
      const localIndex = localCourses.findIndex(c => c._id === courseId);

      if (localIndex !== -1) {
        // Update localStorage
        const updated = { ...updatedCourse, updatedAt: new Date().toISOString() };
        localCourses[localIndex] = updated;
        localStorage.setItem("courses", JSON.stringify(localCourses));
        setCourse(updated);
        showToast("success", "Updated successfully!");
      } else {
        // Update via API
        const response = await axios.put(`${API_BASE}/${courseId}`, updatedCourse);
        setCourse(response.data);
        showToast("success", "Updated successfully!");
      }
    } catch (error) {
      console.error("Error updating course:", error);
      showToast("error", "Failed to update. Please try again.");
      fetchCourse();
    } finally {
      setSaving(false);
    }
  };

  // ─── Module Operations ───
  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) return;
    const updatedCourse = { ...course };
    if (!updatedCourse.modules) updatedCourse.modules = [];

    updatedCourse.modules.push({ title: newModuleTitle, lessons: [] });
    setNewModuleTitle("");
    setIsAddingModule(false);
    await saveCourse(updatedCourse);
  };

  const handleDeleteModule = async (moduleIndex) => {
    if (!window.confirm("Are you sure you want to delete this module and all its lessons?")) return;
    const updatedCourse = { ...course };
    updatedCourse.modules.splice(moduleIndex, 1);
    await saveCourse(updatedCourse);
  };

  const handleEditModule = (moduleIndex) => {
    setEditingModuleIndex(moduleIndex);
    setEditModuleTitle(course.modules[moduleIndex].title);
  };

  const handleSaveModuleEdit = async () => {
    if (!editModuleTitle.trim()) return;
    const updatedCourse = { ...course };
    updatedCourse.modules[editingModuleIndex].title = editModuleTitle;
    setEditingModuleIndex(null);
    setEditModuleTitle("");
    await saveCourse(updatedCourse);
  };

  // ─── Lesson Operations ───
  const handleAddLesson = async (moduleIndex) => {
    if (!newLesson.title.trim()) return;
    const updatedCourse = { ...course };
    updatedCourse.modules[moduleIndex].lessons.push({ ...newLesson });
    setNewLesson({ title: "", type: "video", duration: "10m" });
    setAddingLessonTo(null);
    await saveCourse(updatedCourse);
  };

  const handleDeleteLesson = async (moduleIndex, lessonIndex) => {
    if (!window.confirm("Delete this lesson?")) return;
    const updatedCourse = { ...course };
    updatedCourse.modules[moduleIndex].lessons.splice(lessonIndex, 1);
    await saveCourse(updatedCourse);
  };

  const handleEditLesson = (moduleIndex, lessonIndex) => {
    const lesson = course.modules[moduleIndex].lessons[lessonIndex];
    setEditingLesson({ moduleIndex, lessonIndex });
    setEditLessonData({ title: lesson.title, type: lesson.type, duration: lesson.duration || "10m" });
  };

  const handleSaveLessonEdit = async () => {
    if (!editLessonData.title.trim()) return;
    const { moduleIndex, lessonIndex } = editingLesson;
    const updatedCourse = { ...course };
    updatedCourse.modules[moduleIndex].lessons[lessonIndex] = {
      ...updatedCourse.modules[moduleIndex].lessons[lessonIndex],
      ...editLessonData
    };
    setEditingLesson(null);
    await saveCourse(updatedCourse);
  };

  // ─── Icon Helper ───
  const getLessonIcon = (type) => {
    switch (type) {
      case "video": return <Video size={18} />;
      case "text": return <FileText size={18} />;
      case "quiz": return <HelpCircle size={18} />;
      case "assignment": return <FilePlus size={18} />;
      default: return <Video size={18} />;
    }
  };

  const getLessonEmoji = (type) => {
    switch (type) {
      case "video": return "🎥";
      case "text": return "📄";
      case "quiz": return "❓";
      case "assignment": return "📝";
      default: return "🎥";
    }
  };

  // ─── Stats ───
  const totalModules = course?.modules?.length || 0;
  const totalLessons = course?.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0;

  if (loading) return <div className="loading-state">Loading course details...</div>;
  if (!course) return <div className="error-state">Course not found.</div>;

  return (
    <div className="course-detail-page">
      <DashboardHeader title="Lecture Material Management" user={user} />

      {saving && (
        <div className="loading-spinner-overlay">
          <div className="loading-spinner" />
        </div>
      )}

      <div className="course-detail-container">
        {/* Back Button */}
        <button className="back-button" onClick={() => navigate(-1)}>
          <ChevronLeft size={18} /> Back to Dashboard
        </button>

        {/* Course Header */}
        <div className="course-header">
          <img
            src={course.thumbnail || course.image || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop"}
            alt={course.title}
            className="course-thumbnail"
          />
          <div className="course-info">
            <h1>{course.title}</h1>
            <p>{course.description || course.shortDescription || "No description provided."}</p>
            <div className="course-meta-row">
              <span className="meta-chip price">${course.price || "Free"}</span>
              <span className="meta-chip level">{course.level || "Beginner"}</span>
              <span className="meta-chip category">{course.category || "General"}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="course-tabs">
          <button className={`tab-btn ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>
            Overview
          </button>
          <button className={`tab-btn ${activeTab === "modules" ? "active" : ""}`} onClick={() => setActiveTab("modules")}>
            Modules ({totalModules})
          </button>
          <button className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`} onClick={() => setActiveTab("reviews")}>
            Reviews
          </button>
        </div>

        {/* ─── MODULES TAB ─── */}
        {activeTab === "modules" && (
          <div className="modules-section">
            {/* Stats */}
            <div className="content-stats-bar">
              <div className="content-stat-item">
                <Layers size={20} color="#10b981" />
                <span className="stat-num">{totalModules}</span>
                <span className="stat-text">Modules</span>
              </div>
              <div className="content-stat-item">
                <BookOpen size={20} color="#0ea5e9" />
                <span className="stat-num">{totalLessons}</span>
                <span className="stat-text">Lessons</span>
              </div>
            </div>

            {/* Header */}
            <div className="modules-header">
              <h2>Course Content</h2>
              {!isAddingModule && (
                <button className="btn-primary" onClick={() => setIsAddingModule(true)}>
                  <PlusCircle size={18} /> Add Module
                </button>
              )}
            </div>

            {/* Adding Module Form */}
            {isAddingModule && (
              <div className="add-form">
                <input
                  type="text"
                  placeholder="Module Title (e.g. Section 1: Introduction)"
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleAddModule()}
                />
                <button className="btn-primary" onClick={handleAddModule}>
                  <Check size={16} /> Save
                </button>
                <button className="btn-secondary" onClick={() => { setIsAddingModule(false); setNewModuleTitle(""); }}>
                  <X size={16} /> Cancel
                </button>
              </div>
            )}

            {/* Module List */}
            {(!course.modules || course.modules.length === 0) ? (
              <div className="empty-modules">
                <div className="empty-modules-icon">
                  <Layers size={36} />
                </div>
                <h3>No Modules Yet</h3>
                <p>Start building your course content by adding the first module.</p>
                <button className="btn-primary" onClick={() => setIsAddingModule(true)}>
                  <PlusCircle size={18} /> Add Your First Module
                </button>
              </div>
            ) : (
              course.modules.map((module, mIndex) => (
                <div key={mIndex} className="module-card">
                  {/* Module Header */}
                  <div className="module-header">
                    {editingModuleIndex === mIndex ? (
                      <div className="inline-edit-form">
                        <span className="module-number">{mIndex + 1}</span>
                        <input
                          type="text"
                          value={editModuleTitle}
                          onChange={(e) => setEditModuleTitle(e.target.value)}
                          autoFocus
                          onKeyDown={(e) => e.key === "Enter" && handleSaveModuleEdit()}
                        />
                        <button className="btn-save-inline" onClick={handleSaveModuleEdit}>Save</button>
                        <button className="btn-cancel-inline" onClick={() => setEditingModuleIndex(null)}>Cancel</button>
                      </div>
                    ) : (
                      <h3>
                        <span className="module-number">{mIndex + 1}</span>
                        {module.title}
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 400, marginLeft: '0.5rem' }}>
                          ({module.lessons?.length || 0} lessons)
                        </span>
                      </h3>
                    )}
                    {editingModuleIndex !== mIndex && (
                      <div className="module-actions">
                        <button
                          className="btn-secondary"
                          onClick={() => setAddingLessonTo(addingLessonTo === mIndex ? null : mIndex)}
                        >
                          {addingLessonTo === mIndex ? (
                            <><X size={14} /> Cancel</>
                          ) : (
                            <><PlusCircle size={14} /> Add Lesson</>
                          )}
                        </button>
                        <button className="btn-edit" onClick={() => handleEditModule(mIndex)}>
                          <Edit size={14} />
                        </button>
                        <button className="btn-danger" onClick={() => handleDeleteModule(mIndex)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Lessons */}
                  <div className="lessons-list">
                    {module.lessons && module.lessons.length > 0 ? (
                      module.lessons.map((lesson, lIndex) => (
                        <div key={lIndex} className="lesson-item">
                          {editingLesson?.moduleIndex === mIndex && editingLesson?.lessonIndex === lIndex ? (
                            /* Edit Lesson Inline */
                            <div className="add-form" style={{ margin: 0, borderStyle: 'solid', borderColor: '#10b981', width: '100%' }}>
                              <input
                                type="text"
                                value={editLessonData.title}
                                onChange={(e) => setEditLessonData({ ...editLessonData, title: e.target.value })}
                                autoFocus
                              />
                              <select
                                value={editLessonData.type}
                                onChange={(e) => setEditLessonData({ ...editLessonData, type: e.target.value })}
                              >
                                <option value="video">🎥 Video</option>
                                <option value="text">📄 Text / PDF</option>
                                <option value="quiz">❓ Quiz</option>
                                <option value="assignment">📝 Assignment</option>
                              </select>
                              <input
                                type="text"
                                placeholder="Duration (e.g. 15m)"
                                value={editLessonData.duration}
                                onChange={(e) => setEditLessonData({ ...editLessonData, duration: e.target.value })}
                                style={{ maxWidth: '100px' }}
                              />
                              <button className="btn-primary" onClick={handleSaveLessonEdit}>
                                <Check size={14} />
                              </button>
                              <button className="btn-secondary" onClick={() => setEditingLesson(null)}>
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            /* Normal Lesson View */
                            <>
                              <div className="lesson-info">
                                <span className={`lesson-icon ${lesson.type}`}>
                                  {getLessonIcon(lesson.type)}
                                </span>
                                <span className="lesson-title">{lesson.title}</span>
                              </div>
                              <div className="lesson-meta">
                                <span className={`lesson-type-badge ${lesson.type}`}>
                                  {lesson.type}
                                </span>
                                <span className="lesson-duration">
                                  <Clock size={12} style={{ display: 'inline', marginRight: '3px' }} />
                                  {lesson.duration || "10m"}
                                </span>
                                <div className="lesson-actions">
                                  <button
                                    className="lesson-action-btn edit-lesson"
                                    title="Edit"
                                    onClick={() => handleEditLesson(mIndex, lIndex)}
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button
                                    className="lesson-action-btn"
                                    title="Delete"
                                    onClick={() => handleDeleteLesson(mIndex, lIndex)}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="empty-lessons">No lessons in this module yet. Click "Add Lesson" to begin.</div>
                    )}
                  </div>

                  {/* Add Lesson Form */}
                  {addingLessonTo === mIndex && (
                    <div className="add-lesson-area">
                      <div className="add-form">
                        <select
                          value={newLesson.type}
                          onChange={(e) => setNewLesson({ ...newLesson, type: e.target.value })}
                        >
                          <option value="video">🎥 Video</option>
                          <option value="text">📄 Text / PDF</option>
                          <option value="quiz">❓ Quiz</option>
                          <option value="assignment">📝 Assignment</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Lesson Title"
                          value={newLesson.title}
                          onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                          onKeyDown={(e) => e.key === "Enter" && handleAddLesson(mIndex)}
                        />
                        <input
                          type="text"
                          placeholder="Duration (e.g. 15m)"
                          value={newLesson.duration}
                          onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
                          style={{ maxWidth: '120px' }}
                        />
                        <button className="btn-primary" onClick={() => handleAddLesson(mIndex)}>
                          <PlusCircle size={14} /> Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* ─── OVERVIEW TAB ─── */}
        {activeTab === "overview" && (
          <div className="overview-section">
            <h2>Course Overview</h2>
            <p>{course.description || "No description available."}</p>
          </div>
        )}

        {/* ─── REVIEWS TAB ─── */}
        {activeTab === "reviews" && (
          <div className="reviews-placeholder">
            <h2>Student Reviews</h2>
            <p>Reviews will appear here once students start rating your course.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;
