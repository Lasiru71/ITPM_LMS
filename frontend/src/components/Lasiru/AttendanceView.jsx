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

    const fetchSessions = async () => {
        try {
            const res = await api.get(`/attendance/sessions/${selectedCourseId}`);
            setSessions(res.data);
            if (res.data.length > 0) {
                setSelectedSessionId(res.data[0]._id);
            } else {
                setSelectedSessionId("");
            }
        } catch (error) {
            console.error(error);
            showToast("error", "Failed to load sessions");
        }
    };

    const fetchRoster = async () => {
        try {
            setLoading(true);
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
                    avatar: std.name ? std.name.substring(0, 2).toUpperCase() : "ST"
                };
            });

            setAttendanceData(mapped);
        } catch (error) {
            console.error(error);
            showToast("error", "Failed to load student roster");
        } finally {
            setLoading(false);
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

            showToast("success", "Attendance saved successfully!");
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
    };

    if (!courses || courses.length === 0) {
        return (
            <div className="attendance-view-container animate-in fade-in duration-500">
                <div className="empty-course-state bg-white rounded-2xl border border-dashed border-gray-300" style={{ padding: '4rem', textAlign: 'center' }}>
                    <Calendar size={64} color="#94a3b8" />
                    <h3 style={{ marginTop: '1.5rem', color: '#1e293b' }}>No Courses Found</h3>
                    <p style={{ color: '#64748b' }}>Select or create a course to manage attendance.</p>
                </div>
            </div>
        );
    }

    const selectedCourse = courses.find(c => (c._id || c.id) === selectedCourseId);

    return (
        <div className="attendance-view-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            {/* Header & Controls */}
            <div className="attendance-header" style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) minmax(250px, 1fr) auto', gap: '1.5rem', marginBottom: '2rem', alignItems: 'end' }}>
                <div className="course-selector">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Course</label>
                    <div style={{ position: 'relative' }}>
                        <select 
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', appearance: 'none', background: 'white' }}
                            value={selectedCourseId} 
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                        >
                            {courses.map(course => (
                                <option key={course._id || course.id} value={course._id || course.id}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={14} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }} />
                    </div>
                </div>

                <div className="session-selector">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Date & Session Filter</label>
                    <div style={{ position: 'relative' }}>
                        <select 
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', appearance: 'none', background: 'white' }}
                            value={selectedSessionId}
                            onChange={(e) => setSelectedSessionId(e.target.value)}
                            disabled={sessions.length === 0}
                        >
                            <option value="">{sessions.length === 0 ? "No Sessions Found" : "-- Select Session --"}</option>
                            {sessions.map(session => (
                                <option key={session._id} value={session._id}>
                                    {new Date(session.sessionDate).toLocaleDateString()} - {new Date(session.sessionDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </option>
                            ))}
                        </select>
                        <Filter size={14} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button 
                        className="save-action-btn"
                        onClick={handleSaveAttendance}
                        disabled={isSaving || !selectedSessionId}
                        style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: (isSaving || !selectedSessionId) ? 'not-allowed' : 'pointer', opacity: (isSaving || !selectedSessionId) ? 0.7 : 1 }}
                    >
                        <Save size={18} />
                        {isSaving ? "Saving..." : "Save Attendance"}
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="attendance-stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="attendance-stat-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #f1f5f9', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="stat-icon-box blue" style={{ background: '#eff6ff', color: '#3b82f6', padding: '1rem', borderRadius: '1rem' }}><Users size={24} /></div>
                    <div><div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.total}</div><div style={{ color: '#64748b', fontSize: '0.85rem' }}>Total Enrolled</div></div>
                </div>

                <div className="attendance-stat-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #f1f5f9', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="stat-icon-box green" style={{ background: '#ecfdf5', color: '#10b981', padding: '1rem', borderRadius: '1rem' }}><CheckCircle size={24} /></div>
                    <div><div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.present}</div><div style={{ color: '#64748b', fontSize: '0.85rem' }}>Present</div></div>
                </div>

                <div className="attendance-stat-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #f1f5f9', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="stat-icon-box orange" style={{ background: '#fffbeb', color: '#f59e0b', padding: '1rem', borderRadius: '1rem' }}><Clock size={24} /></div>
                    <div><div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.late}</div><div style={{ color: '#64748b', fontSize: '0.85rem' }}>Late</div></div>
                </div>

                <div className="attendance-stat-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #f1f5f9', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="stat-icon-box purple" style={{ background: '#fef2f2', color: '#ef4444', padding: '1rem', borderRadius: '1rem' }}><XCircle size={24} /></div>
                    <div><div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.absent}</div><div style={{ color: '#64748b', fontSize: '0.85rem' }}>Absent</div></div>
                </div>
            </div>

            {/* Table Area */}
            <div className="attendance-table-card" style={{ background: 'white', borderRadius: '1.5rem', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                <div className="table-header-bar" style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0 }}>Student Roster: {selectedCourse?.title}</h3>
                    {loading && <div style={{ fontSize: '0.85rem', color: '#3b82f6' }}>Refreshing...</div>}
                </div>
                
                <div className="attendance-table-wrap">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#64748b', fontSize: '0.85rem' }}>Student</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#64748b', fontSize: '0.85rem' }}>Email</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#64748b', fontSize: '0.85rem' }}>Status</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#64748b', fontSize: '0.85rem' }}>Health</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceData.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
                                        {selectedSessionId ? "No students enrolled in this course yet." : "Please select a session to view the student roster."}
                                    </td>
                                </tr>
                            ) : (
                                attendanceData.map(student => (
                                    <tr key={student.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                                <div style={{ width: 36, height: 36, borderRadius: '10px', background: '#f1f5f9', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>{student.avatar}</div>
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{student.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{student.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: '#475569' }}>{student.email}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <select 
                                                style={{ padding: '0.4rem 0.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '0.85rem', fontWeight: 500, background: student.status === 'PRESENT' ? '#ecfdf5' : student.status === 'ABSENT' ? '#fef2f2' : '#fffbeb', color: student.status === 'PRESENT' ? '#059669' : student.status === 'ABSENT' ? '#ef4444' : '#d97706' }}
                                                value={student.status}
                                                onChange={(e) => handleStatusChange(student.id, e.target.value)}
                                            >
                                                <option value="PRESENT">Present</option>
                                                <option value="ABSENT">Absent</option>
                                                <option value="LATE">Late</option>
                                            </select>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            {student.status === "ABSENT" ? (
                                                <span style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><XCircle size={14} /> Critical focus</span>
                                            ) : (
                                                <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CheckCircle size={14} /> Normal</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default AttendanceView;
