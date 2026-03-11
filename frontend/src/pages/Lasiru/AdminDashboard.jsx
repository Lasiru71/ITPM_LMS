import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/Lasiru/ToastProvider";
import "../../Styles/Lasiru/AdminDashboard.css";
import LectureManagement from "../../components/Lasiru/LectureManagement";
import StudentManagement from "../../components/Lasiru/StudentManagement";
import { getAllLecturers, getAllStudents } from "../../api/Lasiru/adminApi";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [stats, setStats] = useState({ lecturers: 0, students: 0 });
    const navigate = useNavigate();
    const { showToast } = useToast();

    // Get admin info from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        showToast("success", "Logged out successfully");
        navigate("/login");
    };

    useEffect(() => {
        fetchStats();
    }, [activeTab]);

    const fetchStats = async () => {
        try {
            const lecturers = await getAllLecturers();
            const students = await getAllStudents();
            setStats({
                lecturers: lecturers.length,
                students: students.length,
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case "lecturers":
                return <LectureManagement onUpdate={fetchStats} key="lecturers" />;
            case "students":
                return <StudentManagement onUpdate={fetchStats} key="students" />;
            default:
                return (
                    <div className="admin-overview">
                        <div className="admin-stats-grid">
                            <div className="admin-stat-card">
                                <div className="admin-stat-label">Total Lecturers</div>
                                <div className="admin-stat-value">{stats.lecturers}</div>
                            </div>
                            <div className="admin-stat-card">
                                <div className="admin-stat-label">Total Students</div>
                                <div className="admin-stat-value">{stats.students}</div>
                            </div>
                            <div className="admin-stat-card">
                                <div className="admin-stat-label">System Status</div>
                                <div className="admin-stat-value" style={{ color: "#10b981", fontSize: "1.25rem" }}>Optimal</div>
                            </div>
                        </div>

                        <div className="admin-content-card">
                            <h3>Recent Activity</h3>
                            <p style={{ color: "#94a3b8" }}>No recent management activities recorded.</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="admin-dashboard-container">
            <aside className="admin-sidebar">
                <div className="admin-logo">EduVault ADMIN</div>
                <nav>
                    <div
                        className={`admin-nav-item ${activeTab === "overview" ? "active" : ""}`}
                        onClick={() => setActiveTab("overview")}
                    >
                        <span className="admin-nav-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                        </span> Overview
                    </div>
                    <div
                        className={`admin-nav-item ${activeTab === "lecturers" ? "active" : ""}`}
                        onClick={() => setActiveTab("lecturers")}
                    >
                        <span className="admin-nav-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        </span> Lecturers
                    </div>
                    <div
                        className={`admin-nav-item ${activeTab === "students" ? "active" : ""}`}
                        onClick={() => setActiveTab("students")}
                    >
                        <span className="admin-nav-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                        </span> Students
                    </div>
                </nav>

                <div style={{ marginTop: "auto" }}>
                    <div className="admin-nav-item" onClick={handleLogout}>
                        <span className="admin-nav-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        </span> Logout
                    </div>
                </div>
            </aside>

            <main className="admin-main-content">
                <header className="admin-header">
                    <div className="admin-title">
                        <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                        <p>Manage your institution's resources and users</p>
                    </div>
                    <div className="admin-user-profile">
                        <div style={{ textAlign: "right" }}>
                            <div style={{ fontWeight: 600, color: "white" }}>{user.name || "Administrator"}</div>
                            <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{user.email}</div>
                        </div>
                        <div className="admin-avatar">
                            {user.name ? user.name.charAt(0).toUpperCase() : "A"}
                        </div>
                    </div>
                </header>

                {renderContent()}
            </main>
        </div>
    );
};

export default AdminDashboard;
