import React, { useState, useEffect } from "react";
import { Users, CheckCircle, XCircle, Clock, Save, Search, Calendar, Filter, ChevronDown, Download, RefreshCw } from "lucide-react";
import { useToast } from "./ToastProvider";
import api from "../../services/api";
import "../../Styles/Lasiru/AttendanceView.css";
import { getAllStudents } from "../../api/Lasiru/adminApi";

const AttendanceView = ({ courses }) => {
    const { showToast } = useToast();
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [sessions, setSessions] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState("");
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLive, setIsLive] = useState(false); // For auto-refresh

    useEffect(() => {
        if (courses && courses.length > 0 && !selectedCourseId) {
            setSelectedCourseId(courses[0]._id || courses[0].id);
        }
    }, [courses]);

    useEffect(() => {
        if (selectedCourseId) {
            fetchSessions();
        }
    }, [selectedCourseId]);

    useEffect(() => {
        if (selectedSessionId) {
            fetchRoster();
        } else {
            setAttendanceData([]);
        }
    }, [selectedSessionId]);

    // Live Refresh Logic
    useEffect(() => {
        let interval;
        if (isLive && selectedSessionId) {
            interval = setInterval(() => {
                fetchRoster(true); // silent fetch
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [isLive, selectedSessionId]);

    const fetchSessions = async () => {
        try {
            const res = await api.get(`/attendance/sessions/${selectedCourseId}`);
            setSessions(res.data);
            if (res.data.length > 0) {
                // If there's a session today, select it, otherwise select the latest
                const today = new Date().toDateString();
                const todaySession = res.data.find(s => new Date(s.sessionDate).toDateString() === today);
                setSelectedSessionId(todaySession ? todaySession._id : res.data[0]._id);
            } else {
                setSelectedSessionId("");
            }
        } catch (error) {
            console.error(error);
            showToast("error", "Failed to load sessions");
        }
    };

    const fetchRoster = async (isSilent = false) => {
        try {
            if (!isSilent) setLoading(true);
            
            // 1. Get enrolled students
            const studentsRes = await api.get(`/enrollments/course/${selectedCourseId}/students`);
            const enrolledStudents = studentsRes.data;

            // 2. Get attendance records for this session
            const recordsRes = await api.get(`/attendance/records/${selectedSessionId}`);
            const records = recordsRes.data;

            // 3. Merge
            const mapped = enrolledStudents.map(std => {
                const record = records.find(r => r.studentId === (std.studentId || std._id));
                return {
                    id: std.studentId || std._id,
                    dbId: std._id,
                    name: std.name || "Unknown",
                    email: std.email || "N/A",
                    status: record ? record.status : "ABSENT",
                    avatar: std.name ? std.name.substring(0, 2).toUpperCase() : "ST",
                    markedAt: record ? record.createdAt : null
                };
            });

            setAttendanceData(mapped);
        } catch (error) {
            if (!isSilent) {
                console.error(error);
                showToast("error", "Failed to load student roster");
            }
        } finally {
            if (!isSilent) setLoading(false);
        }
    };

    const handleStatusChange = (studentId, newStatus) => {
        setAttendanceData(prev => 
            prev.map(student => 
                student.id === studentId ? { ...student, status: newStatus } : student
            )
        );
    };

    const handleSaveAttendance = async () => {
        try {
            setIsSaving(true);
            const recordsToSave = attendanceData.map(s => ({
                studentId: s.id,
                status: s.status
            }));

            await api.put("/attendance/update-session", {
                sessionId: selectedSessionId,
                records: recordsToSave
            });

            showToast("success", "Attendance updated successfully!");
            fetchRoster();
        } catch (error) {
            console.error(error);
            showToast("error", "Failed to save attendance");
        } finally {
            setIsSaving(false);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "PRESENT": return "status-present";
            case "ABSENT": return "status-absent";
            case "LATE": return "status-late";
            default: return "";
        }
    };

    const stats = {
        total: attendanceData.length,
        present: attendanceData.filter(s => s.status === "PRESENT").length,
        absent: attendanceData.filter(s => s.status === "ABSENT").length,
        late: attendanceData.filter(s => s.status === "LATE").length,
        health: attendanceData.length > 0 ? Math.round((attendanceData.filter(s => s.status === "PRESENT").length / attendanceData.length) * 100) : 0
    };

    if (!courses || courses.length === 0) {
        return (
            <div className="attendance-view-container">
                <div className="empty-course-state" style={{ padding: '5rem', textAlign: 'center', background: 'white', borderRadius: '2rem', border: '2px dashed #e2e8f0' }}>
                    <Calendar size={64} color="#94a3b8" />
                    <h3 style={{ marginTop: '1.5rem', color: '#1e293b', fontSize: '1.5rem' }}>No Courses Found</h3>
                    <p style={{ color: '#64748b' }}>Select or create a course to manage attendance tracking.</p>
                </div>
            </div>
        );
    }

    const selectedCourse = courses.find(c => (c._id || c.id) === selectedCourseId);

    return (
        <div className="attendance-view-container">
            {/* Header & Controls */}
            <div className="attendance-header-v4" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Attendance Monitoring</h2>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0 0' }}>Track and manage student presence in real-time</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button 
                            className={`refresh-btn-v4 ${isLive ? 'active' : ''}`}
                            onClick={() => setIsLive(!isLive)}
                            title="Auto-refresh every 5s"
                            style={{ background: isLive ? '#eff6ff' : '#f8fafc', color: isLive ? '#3b82f6' : '#64748b', borderColor: isLive ? '#3b82f6' : '#e2e8f0' }}
                        >
                            <RefreshCw size={18} className={isLive ? 'animate-spin' : ''} />
                            <span style={{ marginLeft: '8px', fontWeight: 700, fontSize: '0.85rem' }}>{isLive ? 'Live Tracking On' : 'Live Tracking Off'}</span>
                        </button>
                        <button 
                            className="save-action-btn-v4"
                            onClick={handleSaveAttendance}
                            disabled={isSaving || !selectedSessionId}
                        >
                            <Save size={18} />
                            {isSaving ? "Updating..." : "Commit Changes"}
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end' }}>
                    <div className="course-selector-v4">
                        <label>Course</label>
                        <div style={{ position: 'relative' }}>
                            <select 
                                className="styled-select-v4"
                                value={selectedCourseId} 
                                onChange={(e) => setSelectedCourseId(e.target.value)}
                            >
                                {courses.map(course => (
                                    <option key={course._id || course.id} value={course._id || course.id}>
                                        {course.title}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }} />
                        </div>
                    </div>

                    <div className="course-selector-v4">
                        <label>Session Date & Time</label>
                        <div style={{ position: 'relative' }}>
                            <select 
                                className="styled-select-v4"
                                style={{ width: '300px' }}
                                value={selectedSessionId}
                                onChange={(e) => setSelectedSessionId(e.target.value)}
                                disabled={sessions.length === 0}
                            >
                                <option value="">{sessions.length === 0 ? "No Sessions Available" : "-- Select Active Session --"}</option>
                                {sessions.map(session => (
                                    <option key={session._id} value={session._id}>
                                        {new Date(session.sessionDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} at {new Date(session.sessionDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </option>
                                ))}
                            </select>
                            <Calendar size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="attendance-stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="attendance-stat-card-v4 blue">
                    <div className="stat-icon-v4"><Users size={24} /></div>
                    <div className="stat-content-v4">
                        <span className="val">{stats.total}</span>
                        <span className="lbl">Enrolled Students</span>
                    </div>
                </div>

                <div className="attendance-stat-card-v4 green">
                    <div className="stat-icon-v4"><CheckCircle size={24} /></div>
                    <div className="stat-content-v4">
                        <span className="val">{stats.present}</span>
                        <span className="lbl">Present Today</span>
                    </div>
                </div>

                <div className="attendance-stat-card-v4 orange">
                    <div className="stat-icon-v4"><Clock size={24} /></div>
                    <div className="stat-content-v4">
                        <span className="val">{stats.late}</span>
                        <span className="lbl">Late Arrival</span>
                    </div>
                </div>

                <div className="attendance-stat-card-v4 red">
                    <div className="stat-icon-v4"><RefreshCw size={24} /></div>
                    <div className="stat-content-v4">
                        <span className="val">{stats.health}%</span>
                        <span className="lbl">Attendance Rate</span>
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div className="attendance-table-card-v4">
                <div className="table-header-v4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Roster: {selectedCourse?.title}</h3>
                        {isLive && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ecfdf5', padding: '4px 12px', borderRadius: '20px', border: '1px solid #bbf7d0' }}>
                                <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>Live Monitoring</span>
                            </div>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <div style={{ padding: '0.5rem 1rem', background: '#f8fafc', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>
                            Last Sync: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                    </div>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                    <table className="attendance-table-v4">
                        <thead>
                            <tr>
                                <th>Student Details</th>
                                <th>Email Address</th>
                                <th>Marking Status</th>
                                <th>Activity Log</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceData.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '5rem', textAlign: 'center', color: '#94a3b8' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                            <Search size={48} />
                                            <p style={{ fontWeight: 600 }}>{selectedSessionId ? "No students found in this course roster." : "Please select a session to monitor attendance."}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                attendanceData.map(student => (
                                    <tr key={student.id}>
                                        <td>
                                            <div className="student-profile-v4">
                                                <div className="student-initial-v4" style={{ background: student.status === 'PRESENT' ? '#eff6ff' : '#f8fafc', color: student.status === 'PRESENT' ? '#3b82f6' : '#64748b' }}>{student.avatar}</div>
                                                <div className="student-info-v4">
                                                    <span className="name">{student.name}</span>
                                                    <span className="id">{student.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>{student.email}</span>
                                        </td>
                                        <td>
                                            <select 
                                                className={`status-select-v4 ${getStatusClass(student.status)}`}
                                                value={student.status}
                                                onChange={(e) => handleStatusChange(student.id, e.target.value)}
                                            >
                                                <option value="PRESENT">Present</option>
                                                <option value="ABSENT">Absent</option>
                                                <option value="LATE">Late</option>
                                            </select>
                                        </td>
                                        <td>
                                            <div className="status-indicator-v4">
                                                <div className={`dot ${student.status.toLowerCase()}`}></div>
                                                <span className={student.status.toLowerCase()}>
                                                    {student.status === "PRESENT" ? (
                                                        <>Recorded {student.markedAt ? `at ${new Date(student.markedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : "via Scanner"}</>
                                                    ) : student.status === "LATE" ? (
                                                        "Tardy"
                                                    ) : (
                                                        "Not marked"
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes pulse {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}} />
        </div>
    );
};

export default AttendanceView;
