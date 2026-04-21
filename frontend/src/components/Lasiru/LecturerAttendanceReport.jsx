import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { Search, FileText, User, Calendar, AlertCircle } from "lucide-react";
import { useToast } from "./ToastProvider";

const LecturerAttendanceReport = () => {
    const { showToast } = useToast();
    const [studentId, setStudentId] = useState("");
    const [courses, setCourses] = useState([]);
    const [courseId, setCourseId] = useState("");
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await api.get("/courses");
            setCourses(res.data);
        } catch (error) {
            console.error(error);
            showToast("error", "Failed to load courses");
        }
    };

    const handleCheck = async (e) => {
        e.preventDefault();
        setReport(null);

        if (!studentId || !courseId) {
            showToast("error", "Please provide both Student ID and Course");
            return;
        }

        try {
            setLoading(true);
            const res = await api.get(`/attendance/monthly/${studentId}/${courseId}`);
            setReport(res.data);
            showToast("success", "Attendance report loaded");
        } catch (error) {
            showToast("error", error.response?.data?.message || "Failed to fetch report");
        } finally {
            setLoading(false);
        }
    };

    const selectedCourse = courses.find((course) => course._id === courseId);
    const percentage = Number(report?.percentage || 0);

    return (
        <div className="attendance-report" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                <div className="report-search">
                    <form onSubmit={handleCheck} style={{ background: 'white', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                        <h3 style={{ margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Search size={20} color="#3b82f6" /> Report Search
                        </h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Student ID</label>
                            <input 
                                type="text" 
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                placeholder="IT2023001"
                                required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}
                            />
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Select Course</label>
                            <select 
                                value={courseId}
                                onChange={(e) => setCourseId(e.target.value)}
                                required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}
                            >
                                <option value="">-- Select Course --</option>
                                {courses.map((c) => <option key={c._id} value={c._id}>{c.title}</option>)}
                            </select>
                        </div>

                        <button type="submit" disabled={loading} style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', background: '#3b82f6', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
                            {loading ? "Searching..." : "View Report"}
                        </button>
                    </form>
                </div>

                <div className="report-display">
                    {!report ? (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'white', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0', color: '#94a3b8' }}>
                            <FileText size={48} opacity={0.3} style={{ marginBottom: '1.5rem' }} />
                            <p>Search for a student and course to see the attendance report.</p>
                        </div>
                    ) : (
                        <div style={{ background: 'white', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                <div>
                                    <h3 style={{ margin: 0 }}>{selectedCourse?.title}</h3>
                                    <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0.25rem 0' }}>Report for: <strong>{studentId}</strong></p>
                                </div>
                                <div style={{ 
                                    padding: '0.4rem 1rem', 
                                    borderRadius: '1rem', 
                                    fontSize: '0.85rem', 
                                    fontWeight: 600,
                                    background: report.warning ? '#fef2f2' : (percentage >= 80 ? '#ecfdf5' : '#fffbeb'),
                                    color: report.warning ? '#dc2626' : (percentage >= 80 ? '#059669' : '#d97706'),
                                    border: `1px solid ${report.warning ? '#fee2e2' : (percentage >= 80 ? '#d1fae5' : '#fef3c7')}`
                                }}>
                                    {report.warning ? 'ACTION REQUIRED' : (percentage >= 80 ? 'EXCELLENT' : 'AVERAGE')}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '1rem', textAlign: 'center' }}>
                                    <div style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Total</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{report.totalSessions}</div>
                                </div>
                                <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '1rem', textAlign: 'center' }}>
                                    <div style={{ color: '#166534', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Attended</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#15803d' }}>{report.attendedSessions}</div>
                                </div>
                                <div style={{ background: '#fffbeb', padding: '1rem', borderRadius: '1rem', textAlign: 'center' }}>
                                    <div style={{ color: '#92400e', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Absent</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#b45309' }}>{report.totalSessions - report.attendedSessions}</div>
                                </div>
                                <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '1rem', textAlign: 'center' }}>
                                    <div style={{ color: '#1e40af', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Percentage</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1d4ed8' }}>{report.percentage}%</div>
                                </div>
                            </div>

                            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1.25rem' }}>
                                <h4 style={{ margin: '0 0 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <AlertCircle size={16} /> Attendance Analysis
                                </h4>
                                <div style={{ height: '0.75rem', background: '#e2e8f0', borderRadius: '1rem', overflow: 'hidden', marginBottom: '1rem' }}>
                                    <div style={{ 
                                        height: '100%', 
                                        width: `${percentage}%`, 
                                        background: report.warning ? '#ef4444' : '#10b981',
                                        borderRadius: '1rem'
                                    }}></div>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                                    {report.warning 
                                        ? `Student ${studentId} has a low attendance rate (${percentage}%). It is recommended to contact the student or provide additional support.`
                                        : `Student ${studentId} is maintaining a healthy attendance record (${percentage}%). Keep up the good monitoring!`}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LecturerAttendanceReport;
