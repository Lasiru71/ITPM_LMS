import React, { useState, useEffect } from "react";
import { BookOpen, Plus, Trash2, Edit, Search } from "lucide-react";
import axios from "axios";
import { useToast } from "./ToastProvider";

const CourseManagement = () => {
    const { showToast } = useToast();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:5000/api/courses");
            setCourses(res.data);
        } catch (error) {
            console.error(error);
            showToast("error", "Failed to load courses");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/courses/${id}`);
            showToast("success", "Course deleted successfully");
            fetchCourses();
        } catch (error) {
            showToast("error", "Failed to delete course");
        }
    };

    const filtered = courses.filter(c => 
        c.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.courseId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="course-management" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                    <input 
                        type="text" 
                        placeholder="Search courses..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}
                    />
                </div>
                <button className="admin-btn admin-btn-primary" onClick={() => window.location.href = '/create-course'}>
                    <Plus size={18} /> Create New Course
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {filtered.map(course => (
                    <div key={course._id} style={{ background: 'white', borderRadius: '1.25rem', overflow: 'hidden', border: '1px solid #f1f5f9', transition: 'transform 0.2s' }}>
                        <div style={{ height: '160px', overflow: 'hidden', background: '#f8fafc' }}>
                            {course.image ? (
                                <img src={course.image} alt={course.title} style={{ width: '100%', hieght: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                                    <BookOpen size={48} />
                                </div>
                            )}
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '0.5rem' }}>{course.courseId || 'CID-' + course._id.slice(-4)}</div>
                            <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 700 }}>{course.title}</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontWeight: 700, color: '#10b981' }}>Rs. {(course.price || course.fee || 0).toLocaleString()}</div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => window.location.href = `/edit-course/${course._id}`} style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', color: '#64748b', cursor: 'pointer' }}><Edit size={16} /></button>
                                    <button onClick={() => handleDelete(course._id)} style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #fee2e2', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseManagement;
