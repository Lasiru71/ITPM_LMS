import React, { useState, useEffect } from "react";
import { Users, CheckCircle, XCircle, Clock, Save, Download, ChevronDown } from "lucide-react";
import { useToast } from "./ToastProvider";
import "../../Styles/Lasiru/AttendanceView.css";
import { getAllStudents } from "../../api/Lasiru/adminApi";

const AttendanceView = ({ courses }) => {
    const { showToast } = useToast();
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [attendanceData, setAttendanceData] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    // Mock students data for the selected course
    useEffect(() => {
        if (courses && courses.length > 0 && !selectedCourseId) {
            setSelectedCourseId(courses[0]._id || courses[0].id);
        }
    }, [courses]);

    useEffect(() => {
        if (selectedCourseId) {
            const fetchAndSetStudents = async () => {
                try {
                    const data = await getAllStudents();
                    // Map real db students to attendance structure
                    const mappedStudents = data.map(std => {
                        const nameParts = std.name ? std.name.split(" ") : ["U"];
                        const avatar = nameParts.length > 1 
                            ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
                            : (std.name ? std.name.substring(0, 2).toUpperCase() : "UN");

                        return {
                            id: std._id,
                            displayId: std.nicNumber || "N/A",
                            name: std.name || "Unknown",
                            email: std.email || "N/A",
                            status: "Present", // default attendance status
                            avatar: avatar
                        };
                    });
                    setAttendanceData(mappedStudents);
                } catch (error) {
                    console.error("Error fetching students for attendance:", error);
                    showToast("error", "Failed to load students");
                }
            };
            
            fetchAndSetStudents();
        }
    }, [selectedCourseId, showToast]);

    const handleStatusChange = (studentId, newStatus) => {
        setAttendanceData(prev => 
            prev.map(student => 
                student.id === studentId ? { ...student, status: newStatus } : student
            )
        );
    };

    const handleSaveAttendance = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            showToast("success", "Attendance saved successfully!");
        }, 800);
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
                <div className="empty-course-state bg-white rounded-2xl border border-dashed border-gray-300">
                    <Users size={48} />
                    <h3>No Courses Available</h3>
                    <p>Create a course first to manage its attendance.</p>
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
                    <label>Select Course</label>
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

                <button 
                    className="save-action-btn"
                    onClick={handleSaveAttendance}
                    disabled={isSaving}
                >
                    <Save size={18} />
                    {isSaving ? "Saving..." : "Save Attendance"}
                </button>
            </div>

            {/* Stats Row */}
            <div className="attendance-stats-row">
                <div className="attendance-stat-card">
                    <div className="stat-icon-box blue">
                        <Users size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.total}</span>
                        <span className="stat-label">Total Enrolled</span>
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
                        <span className="stat-label">Late</span>
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
                    <h3>Student Roster: {selectedCourse?.title}</h3>
                </div>
                
                <div className="attendance-table-wrap">
                    <table className="attendance-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Actions</th>
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
                                            <span className="text-red-500 text-sm font-medium">Follow up required</span>
                                        ) : (
                                            <span className="text-emerald-500 text-sm font-medium">In good standing</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendanceView;
