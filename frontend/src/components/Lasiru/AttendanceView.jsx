import React, { useState, useEffect } from "react";
import { Users, CheckCircle, XCircle, Clock, Save, Download, ChevronDown, BookOpen } from "lucide-react";
import { useToast } from "./ToastProvider";
import "../../Styles/Lasiru/AttendanceView.css";
import { getAllStudents } from "../../api/Lasiru/adminApi";

const AttendanceView = ({ courses }) => {
    const { showToast } = useToast();
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [attendanceData, setAttendanceData] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [demoId, setDemoId] = useState("");

    // Set initial course
    useEffect(() => {
        if (courses && courses.length > 0 && !selectedCourseId) {
            setSelectedCourseId(courses[0]._id || courses[0].id);
        }
    }, [courses]);

    // Fetch students and set default attendance
    useEffect(() => {
        if (selectedCourseId) {
            const fetchAndSetStudents = async () => {
                try {
                    const data = await getAllStudents();
                    const mappedStudents = data.map(std => ({
                        id: std._id,
                        displayId: std.studentId || std.nicNumber || "N/A",
                        name: std.name || "Unknown",
                        email: std.email || "N/A",
                        status: "Present",
                        avatar: std.name ? std.name.substring(0, 2).toUpperCase() : "ST"
                    }));
                    setAttendanceData(mappedStudents);
                } catch (error) {
                    showToast("error", "Failed to load students");
                }
            };
            fetchAndSetStudents();
        }
    }, [selectedCourseId]);

    const handleSimulateScan = () => {
        if (!demoId.trim()) return;
        const student = attendanceData.find(s => s.displayId === demoId.trim());
        if (student) {
            handleStatusChange(student.id, "Present");
            showToast("success", `Attendance marked for ${student.name}`);
            setDemoId("");
        } else {
            showToast("error", "Student ID not found in roster");
        }
    };

    const handleStatusChange = (studentId, newStatus) => {
        setAttendanceData(prev => 
            prev.map(student => 
                student.id === studentId ? { ...student, status: newStatus } : student
            )
        );
    };

    const handleSaveAttendance = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            showToast("success", "Attendance record saved successfully");
        }, 1000);
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "Present": return "status-present";
            case "Absent": return "status-absent";
            case "Late": return "status-late";
            default: return "";
        }
    };

    const stats = {
        total: attendanceData.length,
        present: attendanceData.filter(s => s.status === "Present").length,
        absent: attendanceData.filter(s => s.status === "Absent").length,
        late: attendanceData.filter(s => s.status === "Late").length,
    };

    if (!courses || courses.length === 0) {
        return (
            <div className="attendance-view-container animate-in fade-in duration-500">
                <div className="empty-course-state">
                    <Users size={48} />
                    <h3>No Courses Found</h3>
                    <p>Create a course first to start managing attendance.</p>
                </div>
            </div>
        );
    }

    const selectedCourse = courses.find(c => (c._id || c.id) === selectedCourseId) || courses[0];

    return (
        <div className="attendance-view-container">
            {/* Header & Controls */}
            <div className="attendance-header">
                <div className="course-selector">
                    <label>Active Course Session</label>
                    <select 
                        className="styled-select" 
                        value={selectedCourseId} 
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                    >
                        {courses.map(course => (
                            <option key={course._id || course.id} value={course._id || course.id}>
                                {course.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-4">
                    <div className="demo-scanner-box">
                        <span className="flex h-2 w-2">
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        <input 
                            type="text" 
                            placeholder="Scan Student ID..." 
                            value={demoId}
                            onChange={(e) => setDemoId(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSimulateScan()}
                        />
                        <button onClick={handleSimulateScan}>Scan</button>
                    </div>

                    <button 
                        className="save-action-btn"
                        onClick={handleSaveAttendance}
                        disabled={isSaving}
                    >
                        <Save size={18} />
                        {isSaving ? "Saving..." : "Save Record"}
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="attendance-stats-row">
                <div className="attendance-stat-card">
                    <div className="stat-icon-box blue">
                        <Users size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.total}</span>
                        <span className="stat-label">Enrolled</span>
                    </div>
                </div>

                <div className="attendance-stat-card">
                    <div className="stat-icon-box green">
                        <CheckCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.present}</span>
                        <span className="stat-label">Present</span>
                    </div>
                </div>

                <div className="attendance-stat-card">
                    <div className="stat-icon-box orange">
                        <Clock size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.late}</span>
                        <span className="stat-label">Late Arrival</span>
                    </div>
                </div>

                <div className="attendance-stat-card">
                    <div className="stat-icon-box purple">
                        <XCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.absent}</span>
                        <span className="stat-label">Absent</span>
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div className="attendance-table-card">
                <div className="table-header-bar">
                    <h3>
                        <BookOpen size={18} style={{marginRight: '8px'}} />
                        Student Roster: <span className="highlight-course">{selectedCourse?.title}</span>
                    </h3>
                </div>
                
                <div className="attendance-table-wrap">
                    <table className="attendance-table">
                        <thead>
                            <tr>
                                <th>Student Information</th>
                                <th>Email</th>
                                <th>Attendance Status</th>
                                <th>Academic Standing</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceData.map(student => (
                                <tr key={student.id}>
                                    <td>
                                        <div className="student-info-cell">
                                            <div className="student-avatar">{student.avatar}</div>
                                            <div className="student-details">
                                                <span className="student-name">{student.name}</span>
                                                <span className="student-id">{student.displayId}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{student.email}</td>
                                    <td>
                                        <select 
                                            className={`status-select ${getStatusClass(student.status)}`}
                                            value={student.status}
                                            onChange={(e) => handleStatusChange(student.id, e.target.value)}
                                        >
                                            <option value="Present">Present</option>
                                            <option value="Absent">Absent</option>
                                            <option value="Late">Late</option>
                                        </select>
                                    </td>
                                    <td>
                                        {student.status === "Absent" ? (
                                            <span style={{ color: "#ef4444", fontSize: "0.85rem", fontWeight: 700 }}>Action Required</span>
                                        ) : student.status === "Late" ? (
                                            <span style={{ color: "#f59e0b", fontSize: "0.85rem", fontWeight: 700 }}>Late Arrival Warning</span>
                                        ) : (
                                            <span style={{ color: "#10b981", fontSize: "0.85rem", fontWeight: 700 }}>Satisfactory</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {attendanceData.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="no-data-row">No students enrolled in this course yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendanceView;
