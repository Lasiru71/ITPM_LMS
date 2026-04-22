import React, { useState, useEffect } from "react";
import { Users, CheckCircle, XCircle, Clock, Save, Search, Calendar, Filter, ChevronDown, Download, RefreshCw, FileText } from "lucide-react";
import { useToast } from "./ToastProvider";
import api from "../../services/api";
import "../../Styles/Lasiru/AttendanceView.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
        let interval;
        if (selectedSessionId) {
            fetchRoster();
            // Auto-refresh every 5 seconds to show students as they scan QR codes
            interval = setInterval(fetchRoster, 5000);
        } else {
            setAttendanceData([]);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
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
            // Only show loading spinner on first load to avoid flickering during polling
            if (attendanceData.length === 0) setLoading(true);
            
            const studentsRes = await api.get(`/enrollments/course/${selectedCourseId}/students`);
            const enrolledStudents = studentsRes.data;

            const recordsRes = await api.get(`/attendance/records/${selectedSessionId}`);
            const records = recordsRes.data;

            const enrolledMap = new Map();
            enrolledStudents.forEach(std => {
                const id = std.studentId || std._id || std.id;
                enrolledMap.set(String(id), {
                    id: String(id),
                    name: std.name || "Enrolled Student",
                    email: std.email || "N/A",
                    avatar: std.name ? std.name.substring(0, 2).toUpperCase() : "ST",
                    status: "ABSENT"
                });
            });

            records.forEach(rec => {
                const sid = String(rec.studentId);
                if (enrolledMap.has(sid)) {
                    enrolledMap.get(sid).status = rec.status;
                } else {
                    enrolledMap.set(sid, {
                        id: sid,
                        name: "Guest Student",
                        email: "External Join",
                        avatar: "QR",
                        status: rec.status
                    });
                }
            });

            setAttendanceData(Array.from(enrolledMap.values()));
        } catch (error) {
            console.error("Fetch error:", error);
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

            showToast("success", "Attendance records synchronized!");
            
            const confirmDownload = window.confirm("Records saved. Generate PDF report now?");
            if (confirmDownload) generatePDF();
            
            fetchRoster();
        } catch (error) {
            console.error("Save error:", error);
            const errMsg = error.response?.data?.message || error.message || "Server connection error";
            showToast("error", `Failed: ${errMsg}`);
        } finally {
            setIsSaving(false);
        }
    };

    const generatePDF = () => {
        if (!selectedSessionId || attendanceData.length === 0) {
            showToast("warning", "No attendance data to download");
            return;
        }

        const doc = new jsPDF();
        const selectedSession = sessions.find(s => s._id === selectedSessionId);
        const selectedCourse = courses.find(c => (c._id || c.id) === selectedCourseId);
        
        const dateStr = new Date(selectedSession.sessionDate).toLocaleDateString();
        const timeStr = new Date(selectedSession.sessionDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        doc.setFontSize(22);
        doc.setTextColor(30, 41, 59);
        doc.text("Attendance Report", 14, 22);
        
        doc.setFontSize(12);
        doc.setTextColor(100, 116, 139);
        doc.text(`Course: ${selectedCourse?.title || "N/A"}`, 14, 32);
        doc.text(`Session: ${dateStr} at ${timeStr}`, 14, 38);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 44);

        const stats = getStats();
        doc.setFontSize(11);
        doc.setTextColor(30, 41, 59);
        doc.text(`Summary: Total ${stats.total} | Present ${stats.present} | Late ${stats.late} | Absent ${stats.absent}`, 14, 55);

        const tableColumn = ["ID", "Student Name", "Email", "Status"];
        const tableRows = attendanceData.map(student => [
            student.id,
            student.name,
            student.email,
            student.status
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 65,
            theme: 'grid',
            headStyles: { fillColor: [37, 99, 235], fontWeight: 'bold' },
            styles: { fontSize: 9 }
        });

        doc.save(`Attendance_${selectedCourse?.title.replace(/\s+/g, '_')}_${dateStr}.pdf`);
        showToast("success", "Attendance PDF Downloaded");
    };

    const getStats = () => ({
        total: attendanceData.length,
        present: attendanceData.filter(s => s.status === "PRESENT").length,
        absent: attendanceData.filter(s => s.status === "ABSENT").length,
        late: attendanceData.filter(s => s.status === "LATE").length,
    });

    const stats = getStats();

    if (!courses || courses.length === 0) {
        return (
            <div className="attendance-view-container">
                <div className="empty-course-state" style={{ padding: '6rem 2rem', textAlign: 'center', background: 'white', borderRadius: '2rem', border: '1px dashed #e2e8f0' }}>
                    <Calendar size={64} color="#94a3b8" />
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginTop: '1.5rem' }}>No Courses Found</h3>
                    <p style={{ color: '#64748b' }}>Create or join a course to start tracking attendance.</p>
                </div>
            </div>
        );
    }

    const selectedCourse = courses.find(c => (c._id || c.id) === selectedCourseId);

    return (
        <div className="attendance-view-container">
            <div className="attendance-header-v4" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    <div className="course-selector-v4">
                        <label>Select Course</label>
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
                        <label>Session & Date Filter</label>
                        <div style={{ position: 'relative' }}>
                            <select 
                                className="styled-select-v4"
                                value={selectedSessionId}
                                onChange={(e) => setSelectedSessionId(e.target.value)}
                                disabled={sessions.length === 0}
                            >
                                <option value="">{sessions.length === 0 ? "No Sessions Found" : "-- Choose Session --"}</option>
                                {sessions.map(session => (
                                    <option key={session._id} value={session._id}>
                                        {new Date(session.sessionDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} - {new Date(session.sessionDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </option>
                                ))}
                            </select>
                            <Filter size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }} />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                        className="save-action-btn-v4"
                        onClick={handleSaveAttendance}
                        disabled={isSaving || !selectedSessionId}
                    >
                        {isSaving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
                        <span>{isSaving ? "Saving..." : "Save Record"}</span>
                    </button>
                    
                    <button 
                        className="refresh-btn-v4"
                        onClick={generatePDF}
                        disabled={attendanceData.length === 0}
                        title="Download PDF Report"
                    >
                        <Download size={20} />
                    </button>
                </div>
            </div>

            <div className="attendance-stats-grid" style={{ marginBottom: '2.5rem' }}>
                <div className="attendance-stat-card-v4 blue">
                    <div className="stat-icon-v4"><Users size={24} /></div>
                    <div className="stat-content-v4"><span className="val">{stats.total}</span><span className="lbl">Enrolled</span></div>
                </div>
                <div className="attendance-stat-card-v4 green">
                    <div className="stat-icon-v4"><CheckCircle size={24} /></div>
                    <div className="stat-content-v4"><span className="val">{stats.present}</span><span className="lbl">Present</span></div>
                </div>
                <div className="attendance-stat-card-v4 orange">
                    <div className="stat-icon-v4"><Clock size={24} /></div>
                    <div className="stat-content-v4"><span className="val">{stats.late}</span><span className="lbl">Late</span></div>
                </div>
                <div className="attendance-stat-card-v4 red">
                    <div className="stat-icon-v4"><XCircle size={24} /></div>
                    <div className="stat-content-v4"><span className="val">{stats.absent}</span><span className="lbl">Absent</span></div>
                </div>
            </div>

            <div className="attendance-table-card-v4">
                <div className="table-header-v4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>Student Attendance List</h3>
                        <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>Tracking roster for {selectedCourse?.title}</p>
                    </div>
                    <div className="status-indicator-v4">
                        <span className="present">Present: {stats.present}</span>
                        <span className="absent">Absent: {stats.absent}</span>
                    </div>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                    <table className="attendance-table-v4">
                        <thead>
                            <tr>
                                <th>Student Details</th>
                                <th>Attendance Status</th>
                                <th>Status Marker</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceData.length === 0 ? (
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'center', padding: '5rem 0', color: '#94a3b8' }}>
                                        <FileText size={48} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.2 }} />
                                        {selectedSessionId ? "No students currently enrolled." : "Please select a session to view the roster."}
                                    </td>
                                </tr>
                            ) : (
                                attendanceData.map(student => (
                                    <tr key={student.id}>
                                        <td>
                                            <div className="student-profile-v4">
                                                <div className="student-initial-v4">{student.avatar}</div>
                                                <div className="student-info-v4">
                                                    <span className="name">{student.name}</span>
                                                    <span className="id">{student.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <select 
                                                className={`status-select-v4 ${student.status.toLowerCase() === 'present' ? 'status-present' : student.status.toLowerCase() === 'absent' ? 'status-absent' : 'status-late'}`}
                                                value={student.status}
                                                onChange={(e) => handleStatusChange(student.id, e.target.value)}
                                            >
                                                <option value="PRESENT">Present</option>
                                                <option value="LATE">Late</option>
                                            </select>
                                        </td>
                                        <td>
                                            <div className="status-indicator-v4">
                                                <div className={`dot ${student.status.toLowerCase()}`}></div>
                                                <span className={student.status.toLowerCase()}>{student.status}</span>
                                            </div>
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
