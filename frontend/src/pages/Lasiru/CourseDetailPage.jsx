import React, { useState, useEffect, useRef } from "react";
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
  Upload,
  File,
  Eye,
  Presentation,
  Star,
  MessageSquare
} from "lucide-react";
import DashboardHeader from "../../components/Lasiru/DashboardHeader";
import { useToast } from "../../components/Lasiru/ToastProvider";
import { getAllReviews } from "../../api/Lasiru/reviewApi";

import "../../Styles/Lasiru/CourseDetailPage.css";

const API_BASE = "http://localhost:5000/api/courses";
const BACKEND_URL = "http://localhost:5000";

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [user] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("modules");
  const [reviews, setReviews] = useState([]);

  // State for Add Module
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");

  // State for editing module
  const [editingModuleIndex, setEditingModuleIndex] = useState(null);
  const [editModuleTitle, setEditModuleTitle] = useState("");

  // Helper for Local Datetime in YYYY-MM-DDTHH:mm format
  const getLocalCurrentDatetime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 16);
  };

  // State for Add Lesson
  const [addingLessonTo, setAddingLessonTo] = useState(null);
  const [newLesson, setNewLesson] = useState({
    title: "",
    type: "video",
    duration: "10m",
    fileUrl: "",
    description: "",
    deadline: "",
    publishDate: getLocalCurrentDatetime()
  });
  const [newLessonFile, setNewLessonFile] = useState(null);

  // State for editing lesson
  const [editingLesson, setEditingLesson] = useState(null);
  const [editLessonData, setEditLessonData] = useState({ 
    title: "", 
    type: "video", 
    duration: "10m", 
    fileUrl: "",
    description: "",
    deadline: "",
    publishDate: ""
  });
  const [editLessonFile, setEditLessonFile] = useState(null);

  // File input refs
  const addFileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  const handleFileChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      showToast("error", "File size exceeds 5MB limit.");
      if (isEdit) {
        if (editFileInputRef.current) editFileInputRef.current.value = "";
        setEditLessonFile(null);
      } else {
        if (addFileInputRef.current) addFileInputRef.current.value = "";
        setNewLessonFile(null);
      }
      return;
    }
    if (isEdit) {
      setEditLessonFile(file);
    } else {
      setNewLessonFile(file);
    }
  };

  // Upload progress
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchCourse = async () => {
    try {
      const localCourses = JSON.parse(localStorage.getItem("courses") || "[]");
      const localCourse = localCourses.find(c => c._id === courseId);

      if (localCourse) {
        setCourse(localCourse);
        setLoading(false);
        return;
      }

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
    const loadReviews = async () => {
      try {
        const data = await getAllReviews();
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading reviews:", err);
      }
    };
    loadReviews();
  }, [courseId]);

  // Helper to save course (for module operations that don't need file upload)
  const saveCourse = async (updatedCourse) => {
    setSaving(true);
    try {
      const localCourses = JSON.parse(localStorage.getItem("courses") || "[]");
      const localIndex = localCourses.findIndex(c => c._id === courseId);

      if (localIndex !== -1) {
        const updated = { ...updatedCourse, updatedAt: new Date().toISOString() };
        localCourses[localIndex] = updated;
        localStorage.setItem("courses", JSON.stringify(localCourses));
        setCourse(updated);
        showToast("success", "Updated successfully!");
      } else {
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

  // ─── Lesson Operations (with file upload) ───
  const handleAddLesson = async (moduleIndex) => {
    if (!newLesson.title.trim()) {
      showToast("error", "Please enter a lesson title.");
      return;
    }

    if (newLesson.type === 'assignment') {
      const nowLocal = getLocalCurrentDatetime();
      if (newLesson.publishDate !== nowLocal) {
        showToast("error", "Publish date must be set to the current time.");
        setNewLesson(prev => ({ ...prev, publishDate: nowLocal }));
        return;
      }
      if (newLesson.deadline && newLesson.deadline <= nowLocal) {
        showToast("error", "Deadline must be in the future.");
        return;
      }
    }

    setSaving(true);
    setUploadProgress(0);

    try {
      const localCourses = JSON.parse(localStorage.getItem("courses") || "[]");
      const localIndex = localCourses.findIndex(c => c._id === courseId);

      if (localIndex !== -1) {
        setUploadProgress(100);
        await new Promise(r => setTimeout(r, 500));
        const updatedCourse = { ...course };
        const newLessonObj = {
          title: newLesson.title,
          type: newLesson.type,
          duration: newLesson.type === 'video' ? (newLesson.duration || "10m") : "",
          fileUrl: newLessonFile ? URL.createObjectURL(newLessonFile) : (newLesson.fileUrl || ""),
          description: newLesson.type === 'assignment' ? (newLesson.description || "") : "",
          deadline: newLesson.type === 'assignment' ? (newLesson.deadline || "") : null,
          publishDate: newLesson.type === 'assignment' ? (newLesson.publishDate || "") : null
        };
        updatedCourse.modules[moduleIndex].lessons.push(newLessonObj);
        localCourses[localIndex] = updatedCourse;
        localStorage.setItem("courses", JSON.stringify(localCourses));
        setCourse(updatedCourse);

        setNewLesson({ 
          title: "", 
          type: "video", 
          duration: "10m", 
          fileUrl: "",
          description: "",
          deadline: "",
          publishDate: getLocalCurrentDatetime()
        });
        setNewLessonFile(null);
        setAddingLessonTo(null);
        setUploadProgress(0);
        if (addFileInputRef.current) addFileInputRef.current.value = "";
        showToast("success", "Lesson added successfully!");
        return;
      }
      
      const formData = new FormData();
      formData.append("title", newLesson.title);
      formData.append("type", newLesson.type);
      if (newLesson.type === 'video') {
        formData.append("duration", newLesson.duration || "0m");
      }
      
      if (newLesson.type === 'assignment') {
        formData.append("description", newLesson.description || "");
        formData.append("deadline", newLesson.deadline || "");
        formData.append("publishDate", newLesson.publishDate || "");
      }

      if (newLesson.fileUrl) {
        formData.append("fileUrl", newLesson.fileUrl);
      }

      if (newLessonFile) {
        formData.append("file", newLessonFile);
      }

      const response = await axios.post(
        `${API_BASE}/${courseId}/modules/${moduleIndex}/lessons`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        }
      );

      setCourse(response.data);
      setNewLesson({ 
        title: "", 
        type: "video", 
        duration: "10m", 
        fileUrl: "",
        description: "",
        deadline: "",
        publishDate: getLocalCurrentDatetime()
      });
      setNewLessonFile(null);
      setAddingLessonTo(null);
      setUploadProgress(0);
      if (addFileInputRef.current) addFileInputRef.current.value = "";
      showToast("success", "Lesson added successfully!");
    } catch (error) {
      console.error("Error adding lesson:", error);
      showToast("error", error.response?.data?.message || "Failed to add lesson.");
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
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
    setEditLessonData({ 
      title: lesson.title, 
      type: lesson.type, 
      duration: lesson.duration || "10m", 
      fileUrl: lesson.fileUrl || "",
      description: lesson.description || "",
      deadline: lesson.deadline ? new Date(new Date(lesson.deadline).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "",
      publishDate: lesson.publishDate ? new Date(new Date(lesson.publishDate).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : getLocalCurrentDatetime()
    });
    setEditLessonFile(null);
  };

  const handleSaveLessonEdit = async () => {
    if (!editLessonData.title.trim()) return;
    const { moduleIndex, lessonIndex } = editingLesson;

    if (editLessonData.type === 'assignment') {
      const nowLocal = getLocalCurrentDatetime();
      if (editLessonData.publishDate !== nowLocal) {
        showToast("error", "Publish date must be set to the current time.");
        setEditLessonData(prev => ({ ...prev, publishDate: nowLocal }));
        return;
      }
      if (editLessonData.deadline && editLessonData.deadline <= nowLocal) {
        showToast("error", "Deadline must be in the future.");
        return;
      }
    }

    setSaving(true);
    setUploadProgress(0);

    try {
      const localCourses = JSON.parse(localStorage.getItem("courses") || "[]");
      const localIndex = localCourses.findIndex(c => c._id === courseId);

      if (localIndex !== -1) {
        setUploadProgress(100);
        await new Promise(r => setTimeout(r, 500));
        const updatedCourse = { ...course };
        const lesson = updatedCourse.modules[moduleIndex].lessons[lessonIndex];
        lesson.title = editLessonData.title;
        lesson.type = editLessonData.type;
        lesson.duration = editLessonData.type === 'video' ? (editLessonData.duration || "10m") : "";
        if (editLessonFile) {
          lesson.fileUrl = URL.createObjectURL(editLessonFile);
        } else if (editLessonData.fileUrl !== undefined) {
          lesson.fileUrl = editLessonData.fileUrl;
        }
        
        if (editLessonData.type === 'assignment') {
          lesson.description = editLessonData.description;
          lesson.deadline = editLessonData.deadline;
          lesson.publishDate = editLessonData.publishDate;
        } else {
          lesson.description = "";
          lesson.deadline = null;
          lesson.publishDate = null;
        }
        localCourses[localIndex] = updatedCourse;
        localStorage.setItem("courses", JSON.stringify(localCourses));
        setCourse(updatedCourse);

        setEditingLesson(null);
        setEditLessonFile(null);
        setUploadProgress(0);
        showToast("success", "Lesson updated successfully!");
        return;
      }

      const formData = new FormData();
      formData.append("title", editLessonData.title);
      formData.append("type", editLessonData.type);
      if (editLessonData.type === 'video') {
        formData.append("duration", editLessonData.duration || "0m");
      }
      
      if (editLessonData.type === 'assignment') {
        formData.append("description", editLessonData.description || "");
        formData.append("deadline", editLessonData.deadline || "");
        formData.append("publishDate", editLessonData.publishDate || "");
      }

      if (editLessonData.fileUrl) {
        formData.append("fileUrl", editLessonData.fileUrl);
      }

      if (editLessonFile) {
        formData.append("file", editLessonFile);
      }

      const response = await axios.put(
        `${API_BASE}/${courseId}/modules/${moduleIndex}/lessons/${lessonIndex}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        }
      );

      setCourse(response.data);
      setEditingLesson(null);
      setEditLessonFile(null);
      setUploadProgress(0);
      showToast("success", "Lesson updated successfully!");
    } catch (error) {
      console.error("Error updating lesson:", error);
      showToast("error", error.response?.data?.message || "Failed to update lesson.");
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };

  // ─── Helpers ───
  const getLessonIcon = (type) => {
    switch (type) {
      case "video": return <Video size={18} />;
      case "pdf": return <FileText size={18} />;
      case "ppt": return <Presentation size={18} />;
      case "assignment": return <FilePlus size={18} />;
      default: return <Video size={18} />;
    }
  };

  const getAcceptedFileTypes = (type) => {
    switch (type) {
      case "video": return "video/mp4,video/webm,video/avi,video/x-msvideo,video/x-matroska,video/quicktime";
      case "pdf": return "application/pdf";
      case "ppt": return "application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation";
      case "assignment": return "application/pdf";
      default: return "";
    }
  };

  const getFileTypeLabel = (type) => {
    switch (type) {
      case "video": return "Video (MP4, WebM, AVI, MKV, MOV)";
      case "pdf": return "PDF Document";
      case "ppt": return "PowerPoint Presentation (PPT, PPTX)";
      case "assignment": return "Assignment File (PDF)";
      default: return "";
    }
  };

  const shouldShowFileUpload = (type) => {
    return type === "video" || type === "pdf" || type === "ppt" || type === "assignment";
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileUrl = (url) => {
    if (!url) return "#";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:")) {
      return url;
    }
    return `${BACKEND_URL}${url.startsWith("/") ? "" : "/"}${url}`;
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
          <div className="upload-progress-container">
            <div className="loading-spinner" />
            {uploadProgress > 0 && (
              <div className="upload-progress-bar-wrapper">
                <div className="upload-progress-bar" style={{ width: `${uploadProgress}%` }} />
                <span className="upload-progress-text">{uploadProgress}%</span>
              </div>
            )}
          </div>
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
                            <div className="add-lesson-form-expanded" style={{ width: '100%' }}>
                              <div className="lesson-form-row">
                                <input
                                  type="text"
                                  value={editLessonData.title}
                                  onChange={(e) => setEditLessonData({ ...editLessonData, title: e.target.value })}
                                  placeholder={editLessonData.type === 'assignment' ? "Assignment Title" : "Lesson Title"}
                                  autoFocus
                                />
                                <select
                                  value={editLessonData.type}
                                  onChange={(e) => {
                                    setEditLessonData({ ...editLessonData, type: e.target.value });
                                    setEditLessonFile(null);
                                    if (editFileInputRef.current) editFileInputRef.current.value = "";
                                  }}
                                >
                                  <option value="video">🎥 Video</option>
                                  <option value="pdf">📄 PDF</option>
                                  <option value="ppt">📊 PPT</option>
                                  <option value="assignment">📝 Assignment</option>
                                </select>
                                  {editLessonData.type === 'video' && (
                                    <input
                                      type="text"
                                      placeholder="Duration (e.g. 15m)"
                                      value={editLessonData.duration}
                                      onChange={(e) => setEditLessonData({ ...editLessonData, duration: e.target.value })}
                                      style={{ maxWidth: '100px' }}
                                    />
                                  )}
                              </div>

                              {/* Assignment Specific Fields */}
                              {editLessonData.type === 'assignment' && (
                                <div className="assignment-extra-fields">
                                  <div className="assignment-section-title" style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1e293b', marginBottom: '0.25rem' }}>
                                    Upload Assignment
                                  </div>
                                  <div className="assignment-form-group">
                                    <label>Description / Instructions</label>
                                    <textarea
                                      placeholder="Enter assignment instructions, guidelines, and expectations..."
                                      value={editLessonData.description}
                                      onChange={(e) => setEditLessonData({ ...editLessonData, description: e.target.value })}
                                      rows={4}
                                    />
                                  </div>
                                  <div className="assignment-form-row-dates">
                                    <div className="assignment-form-group">
                                      <label>Publish Date</label>
                                      <input
                                        type="datetime-local"
                                        value={editLessonData.publishDate}
                                        min={getLocalCurrentDatetime()}
                                        max={getLocalCurrentDatetime()}
                                        onChange={(e) => setEditLessonData({ ...editLessonData, publishDate: e.target.value })}
                                      />
                                    </div>
                                    <div className="assignment-form-group">
                                      <label>Deadline</label>
                                      <input
                                        type="datetime-local"
                                        value={editLessonData.deadline}
                                        min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000 + 60000).toISOString().slice(0, 16)}
                                        onChange={(e) => setEditLessonData({ ...editLessonData, deadline: e.target.value })}
                                      />
                                    </div>
                                  </div>
                                  <div className="assignment-upload-label" style={{ fontWeight: 700, fontSize: '0.9rem', color: '#334155', marginTop: '0.5rem' }}>
                                    Upload Reference File (Optional, max 5MB)
                                  </div>
                                </div>
                              )}

                              {/* File Upload for Edit */}
                              {shouldShowFileUpload(editLessonData.type) && (
                                <div className="file-upload-area">
                                  {editLessonData.type === "video" && (
                                    <div className="video-url-input-container">
                                      <input
                                        type="text"
                                        placeholder="Paste Video URL (e.g. YouTube, Vimeo) OR upload file below"
                                        value={editLessonData.fileUrl || ""}
                                        onChange={(e) => setEditLessonData({ ...editLessonData, fileUrl: e.target.value })}
                                        className="lesson-url-input"
                                        style={{ width: '100%', padding: '0.5rem', marginBottom: '10px', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '14px' }}
                                      />
                                    </div>
                                  )}
                                  <div className="file-upload-zone" onClick={() => editFileInputRef.current?.click()}>
                                    <input
                                      ref={editFileInputRef}
                                      type="file"
                                      accept={getAcceptedFileTypes(editLessonData.type)}
                                      onChange={(e) => handleFileChange(e, true)}
                                      style={{ display: 'none' }}
                                    />
                                    {editLessonFile ? (
                                      <div className="file-selected">
                                        <File size={20} />
                                        <div className="file-selected-info">
                                          <span className="file-selected-name">{editLessonFile.name}</span>
                                          <span className="file-selected-size">{formatFileSize(editLessonFile.size)}</span>
                                        </div>
                                        <button
                                          className="file-remove-btn"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setEditLessonFile(null);
                                            if (editFileInputRef.current) editFileInputRef.current.value = "";
                                          }}
                                        >
                                          <X size={14} />
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="file-upload-placeholder">
                                        <Upload size={22} />
                                        <span>
                                          {lesson.fileUrl
                                            ? "Upload new file to replace existing"
                                            : `Click to upload ${getFileTypeLabel(editLessonData.type)}`}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  {lesson.fileUrl && !editLessonFile && (
                                    <div className="existing-file-info">
                                      <File size={14} />
                                      <span>Current file attached</span>
                                      <a href={getFileUrl(lesson.fileUrl)} target="_blank" rel="noopener noreferrer" className="view-file-link">
                                        <Eye size={14} /> View {
                                          editLessonData.type === 'video' ? 'Video' :
                                          editLessonData.type === 'pdf' ? 'PDF' :
                                          editLessonData.type === 'ppt' ? 'PPT' :
                                          editLessonData.type === 'assignment' ? 'Assignment' : 'File'
                                        }
                                      </a>
                                    </div>
                                  )}
                                </div>
                              )}

                              <div className="lesson-form-actions">
                                <button className="btn-primary" onClick={handleSaveLessonEdit}>
                                  <Check size={14} /> Save
                                </button>
                                <button className="btn-secondary" onClick={() => { setEditingLesson(null); setEditLessonFile(null); }}>
                                  <X size={14} /> Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* Normal Lesson View */
                            <>
                              <div className="lesson-info">
                                <span className={`lesson-icon ${lesson.type}`}>
                                  {getLessonIcon(lesson.type)}
                                </span>
                                <div className="lesson-title-group">
                                  <span className="lesson-title">{lesson.title}</span>
                                  {lesson.fileUrl && (
                                    <a
                                      href={getFileUrl(lesson.fileUrl)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="lesson-file-link"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Eye size={12} /> View {
                                        lesson.type === 'video' ? 'Video' :
                                        lesson.type === 'pdf' ? 'PDF' :
                                        lesson.type === 'ppt' ? 'PPT' :
                                        lesson.type === 'assignment' ? 'Assignment' : 'File'
                                      }
                                    </a>
                                  )}
                                </div>
                              </div>
                              <div className="lesson-meta">
                                <span className={`lesson-type-badge ${lesson.type}`}>
                                  {lesson.type}
                                </span>
                                {lesson.fileUrl && (
                                  <span className="lesson-file-badge">
                                    <File size={12} /> File
                                  </span>
                                )}
                                {lesson.type === 'video' && (
                                  <span className="lesson-duration">
                                    <Clock size={12} style={{ display: 'inline', marginRight: '3px' }} />
                                    {lesson.duration || "10m"}
                                  </span>
                                )}
                                <div className="lesson-actions">
                                  <button
                                    className="lesson-action-btn edit-lesson"
                                    title="Edit"
                                    onClick={() => handleEditLesson(mIndex, lIndex)}
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    className="lesson-action-btn"
                                    title="Delete"
                                    onClick={() => handleDeleteLesson(mIndex, lIndex)}
                                  >
                                    <Trash2 size={16} />
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
                      <div className="add-lesson-form-expanded">
                        <div className="lesson-form-row">
                          <select
                            value={newLesson.type}
                            onChange={(e) => {
                              setNewLesson({ ...newLesson, type: e.target.value });
                              setNewLessonFile(null);
                              if (addFileInputRef.current) addFileInputRef.current.value = "";
                            }}
                          >
                            <option value="video">🎥 Video</option>
                            <option value="pdf">📄 PDF</option>
                            <option value="ppt">📊 PPT</option>
                            <option value="assignment">📝 Assignment</option>
                          </select>
                          <input
                            type="text"
                            placeholder={newLesson.type === 'assignment' ? "Assignment Title" : "Lesson Title"}
                            value={newLesson.title}
                            onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                            onKeyDown={(e) => e.key === "Enter" && handleAddLesson(mIndex)}
                          />
                          {newLesson.type === 'video' && (
                            <input
                              type="text"
                              placeholder="Duration (e.g. 15m)"
                              value={newLesson.duration}
                              onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
                              style={{ maxWidth: '120px' }}
                            />
                          )}
                        </div>

                        {/* Assignment Specific Fields */}
                        {newLesson.type === 'assignment' && (
                          <div className="assignment-extra-fields">
                            <div className="assignment-header-ui">
                              <h2>Create Assignment</h2>
                              <p>Welcome back, {user?.name || 'Lecturer'}! Continue managing your courses and materials.</p>
                            </div>
                            <div className="assignment-section-title" style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1e293b', marginBottom: '0.25rem', marginTop: '1rem' }}>
                              Upload Assignment
                            </div>
                            <div className="assignment-form-group">
                              <label>Description / Instructions</label>
                              <textarea
                                placeholder="Enter assignment instructions, guidelines, and expectations..."
                                value={newLesson.description}
                                onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                                rows={4}
                              />
                            </div>
                            <div className="assignment-form-row-dates">
                              <div className="assignment-form-group">
                                <label>Publish Date</label>
                                <input
                                  type="datetime-local"
                                  value={newLesson.publishDate}
                                  min={getLocalCurrentDatetime()}
                                  max={getLocalCurrentDatetime()}
                                  onChange={(e) => setNewLesson({ ...newLesson, publishDate: e.target.value })}
                                />
                              </div>
                              <div className="assignment-form-group">
                                <label>Deadline</label>
                                <input
                                  type="datetime-local"
                                  value={newLesson.deadline}
                                  min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000 + 60000).toISOString().slice(0, 16)}
                                  onChange={(e) => setNewLesson({ ...newLesson, deadline: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="assignment-upload-label" style={{ fontWeight: 700, fontSize: '0.9rem', color: '#334155', marginTop: '0.5rem' }}>
                              Upload Reference File (Optional, max 5MB)
                            </div>
                          </div>
                        )}

                        {/* File Upload */}
                        {shouldShowFileUpload(newLesson.type) && (
                          <div className="file-upload-area">
                            {newLesson.type === "video" && (
                              <div className="video-url-input-container">
                                <input
                                  type="text"
                                  placeholder="Paste Video URL (e.g. YouTube, Vimeo) OR upload file below"
                                  value={newLesson.fileUrl || ""}
                                  onChange={(e) => setNewLesson({ ...newLesson, fileUrl: e.target.value })}
                                  className="lesson-url-input"
                                  style={{ width: '100%', padding: '0.5rem', marginBottom: '10px', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '14px' }}
                                />
                              </div>
                            )}
                            <div className="file-upload-zone" onClick={() => addFileInputRef.current?.click()}>
                              <input
                                ref={addFileInputRef}
                                type="file"
                                accept={getAcceptedFileTypes(newLesson.type)}
                                onChange={(e) => handleFileChange(e, false)}
                                style={{ display: 'none' }}
                              />
                              {newLessonFile ? (
                                <div className="file-selected">
                                  <File size={20} />
                                  <div className="file-selected-info">
                                    <span className="file-selected-name">{newLessonFile.name}</span>
                                    <span className="file-selected-size">{formatFileSize(newLessonFile.size)}</span>
                                  </div>
                                  <button
                                    className="file-remove-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setNewLessonFile(null);
                                      if (addFileInputRef.current) addFileInputRef.current.value = "";
                                    }}
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ) : (
                                <div className="file-upload-placeholder">
                                  <Upload size={22} />
                                  <span>Click to upload {getFileTypeLabel(newLesson.type)}</span>
                                  <span className="file-upload-hint">or drag and drop</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}



                        <div className="lesson-form-actions">
                          <button className="btn-primary" onClick={() => handleAddLesson(mIndex)}>
                            <PlusCircle size={14} /> Add Lesson
                          </button>
                        </div>
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
          <div className="course-detail-reviews-container animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="reviews-tab-header">
              <div className="reviews-tab-title-group">
                <h2>Student Reviews</h2>
                <p>Authentic feedback from students enrolled in this course.</p>
              </div>
              {reviews.filter(r => String(r.courseId) === String(courseId)).length > 0 && (
                <div className="course-rating-summary">
                  <div className="rating-score">
                    <Star size={24} className="star-filled" fill="#f59e0b" color="#f59e0b" />
                    <span className="score-num">
                      {(reviews.filter(r => String(r.courseId) === String(courseId)).reduce((acc, r) => acc + (r.rating || 0), 0) / 
                        reviews.filter(r => String(r.courseId) === String(courseId)).length).toFixed(1)}
                    </span>
                  </div>
                  <span className="rating-count">({reviews.filter(r => String(r.courseId) === String(courseId)).length} reviews)</span>
                </div>
              )}
            </div>

            {reviews.filter(r => String(r.courseId) === String(courseId)).length === 0 ? (
              <div className="reviews-empty-state">
                <div className="empty-reviews-icon">
                  <MessageSquare size={48} />
                </div>
                <h3>No Reviews Yet</h3>
                <p>There are no students ratings for this course at the moment. As soon as students post feedback, it will appear here.</p>
              </div>
            ) : (
              <div className="course-reviews-grid">
                {reviews
                  .filter(r => String(r.courseId) === String(courseId))
                  .map((review, idx) => {
                    const studentName = review.studentId?.name || "Anonymous Student";
                    const initial = studentName.charAt(0).toUpperCase();
                    
                    return (
                      <div key={review._id} className="detail-review-card">
                        <div className="detail-review-header">
                          <div className="detail-student-info">
                            <div className="detail-student-avatar">{initial}</div>
                            <div className="detail-student-text">
                              <h4>{studentName}</h4>
                              <span className="detail-review-date">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="detail-review-rating">
                            <Star size={14} className="star-filled" fill="#f59e0b" color="#f59e0b" />
                            <span>{review.rating}.0</span>
                          </div>
                        </div>
                        <div className="detail-review-body">
                          <p>"{review.comment}"</p>
                        </div>
                        {review.adminReply && (
                          <div className="detail-review-reply">
                            <div className="reply-arrow">↳</div>
                            <div className="reply-content">
                              <strong>Lecturer Response:</strong>
                              <p>{review.adminReply}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                }
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;
