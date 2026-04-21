import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import { QRCodeCanvas } from "qrcode.react";
import { QrCode, RefreshCcw, CheckCircle, Clock } from "lucide-react";
import { useToast } from "./ToastProvider";

const LecturerQRManager = () => {
    const { showToast } = useToast();
    const [courses, setCourses] = useState([]);
    const [courseId, setCourseId] = useState("");
    const [lecturerId, setLecturerId] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCourses();
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user.role === "Lecturer") {
            setLecturerId(user.lecturerId || "LEC001");
        }
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

    const handleGenerate = async (e) => {
        e.preventDefault();
        setResult(null);

        if (!/^LEC\d{3,}$/.test(lecturerId)) {
            showToast("error", "Lecturer ID must be like LEC001");
            return;
        }

        if (!courseId) {
            showToast("error", "Please select a course");
            return;
        }

        try {
            setLoading(true);
            const res = await api.post("/attendance/generate-qr", {
                courseId,
                lecturerId,
            });
            setResult(res.data);
            showToast("success", "QR Session generated!");
        } catch (error) {
            showToast("error", error.response?.data?.message || "QR generation failed");
        } finally {
            setLoading(false);
        }
    };

    const qrValue = result?.qrToken || result?.token || "";
    const selectedCourse = courses.find((course) => course._id === courseId);

    return (
        <div className="qr-manager-container" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="qr-controls">
                    <form onSubmit={handleGenerate} style={{ background: 'white', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                        <h3 style={{ margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <QrCode size={20} color="#3b82f6" /> Session Configuration
                        </h3>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Lecturer ID</label>
                            <input 
                                type="text" 
                                value={lecturerId}
                                onChange={(e) => setLecturerId(e.target.value)}
                                placeholder="LEC001"
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

                        <button type="submit" disabled={loading} style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', background: '#3b82f6', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            {loading ? <RefreshCcw className="animate-spin" size={20} /> : <QrCode size={20} />} 
                            {loading ? "Generating..." : "Generate QR Session"}
                        </button>
                    </form>

                    {result && (
                        <div style={{ marginTop: '1.5rem', background: '#f0fdf4', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #bbf7d0' }}>
                            <h4 style={{ margin: '0 0 1rem', color: '#166534', fontSize: '0.95rem' }}>Active Session Details</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Expires:</span> <span style={{ fontWeight: 600 }}>{result.validUntil || 'N/A'}</span></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>Token:</span> <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{qrValue.slice(0, 15)}...</span></div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="qr-display" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'white', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
                    {!result ? (
                        <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                            <div style={{ width: '200px', height: '200px', border: '2px dashed #cbd5e1', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <QrCode size={64} opacity={0.3} />
                            </div>
                            <p style={{ fontSize: '0.9rem' }}>Generate a session to display QR</p>
                        </div>
                    ) : (
                        <>
                            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#3b82f6', color: 'white', padding: '0.4rem 1rem', borderRadius: '1rem', fontSize: '0.85rem', fontWeight: 600 }}>
                                    <span style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span> Live Session
                                </div>
                                <h3 style={{ marginTop: '1rem', marginBottom: 0 }}>{selectedCourse?.title}</h3>
                            </div>
                            
                            <div style={{ padding: '1rem', background: 'white', border: '12px solid #f8fafc', borderRadius: '1.5rem', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}>
                                <QRCodeCanvas value={qrValue} size={256} />
                            </div>

                            <p style={{ marginTop: '2rem', color: '#64748b', fontSize: '0.85rem', textAlign: 'center' }}>Students can scan this code to mark their attendance for today's session.</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LecturerQRManager;
