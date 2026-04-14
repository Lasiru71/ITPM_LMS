import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    BookOpen,
    PlusCircle,
    Star,
    Settings,
    LogOut,
    Bell,
    ChevronRight,
    Search,
    User
} from "lucide-react";
import { useToast } from "../../components/Lasiru/ToastProvider";
import DashboardHeader from "../../components/Lasiru/DashboardHeader";
import "../../Styles/Lasiru/LecturerDashboard.css";

const LecturerDashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const navigate = useNavigate();
    const { showToast } = useToast();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        showToast("success", "Logged out successfully");
        navigate("/login");
    };

    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { id: "my-courses", label: "MyCourse", icon: <BookOpen size={20} /> },
        { id: "create-course", label: "Create Course", icon: <PlusCircle size={20} /> },
        { id: "reviews", label: "Reviews", icon: <Star size={20} /> },
        { id: "settings", label: "Settings", icon: <Settings size={20} /> },
    ];

    const renderDashboardOverview = () => {
        return (
            <div className="overview-container">
                <div className="welcome-banner">
                    <div className="welcome-content">
                        <h2>Welcome to EduVault Lecturer Studio</h2>
                        <p>Manage your courses, track student progress, and monitor engagement all in one place. You have 2 new reviews pending your response.</p>
                        <button className="primary-btn" onClick={() => setActiveTab('create-course')}>
                            <PlusCircle size={18} /> Create New Course
                        </button>
                    </div>
                    <div className="welcome-illustration">
                        <div className="abstract-shape shape-1"></div>
                        <div className="abstract-shape shape-2"></div>
                        <BookOpen size={64} className="banner-icon" />
                    </div>
                </div>

                <div className="metrics-grid">
                    <div className="metric-card">
                        <div className="metric-icon-wrap bg-blue">
                            <BookOpen size={24} />
                        </div>
                        <div className="metric-info">
                            <h3>Active Courses</h3>
                            <div className="metric-value">12</div>
                            <span className="metric-trend positive">+2 this month</span>
                        </div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-icon-wrap bg-green">
                            <User size={24} />
                        </div>
                        <div className="metric-info">
                            <h3>Total Students</h3>
                            <div className="metric-value">1,248</div>
                            <span className="metric-trend positive">+15% vs last month</span>
                        </div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-icon-wrap bg-purple">
                            <Star size={24} />
                        </div>
                        <div className="metric-info">
                            <h3>Average Rating</h3>
                            <div className="metric-value">4.8</div>
                            <span className="metric-trend positive">From 450 reviews</span>
                        </div>
                    </div>
                </div>

                <div className="recent-activity-section">
                    <h3>Recent Activity</h3>
                    <div className="activity-list">
                        <div className="activity-item">
                            <div className="activity-icon bg-blue-light"><BookOpen size={16} /></div>
                            <div className="activity-details">
                                <p><strong>React Fundamentals</strong> published successfully</p>
                                <span>2 hours ago</span>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon bg-yellow-light"><Star size={16} /></div>
                            <div className="activity-details">
                                <p>New 5-star review from <strong>Kamal Perera</strong></p>
                                <span>5 hours ago</span>
                            </div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-icon bg-green-light"><User size={16} /></div>
                            <div className="activity-details">
                                <p><strong>50 students</strong> enrolled in Node.js Masterclass</p>
                                <span>Yesterday</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        if (activeTab === "dashboard") {
            return renderDashboardOverview();
        }

        return (
            <div className="dashboard-placeholder">
                <div className="placeholder-icon">
                    {navItems.find(item => item.id === activeTab)?.icon}
                </div>
                <h2>{navItems.find(item => item.id === activeTab)?.label}</h2>
                <p>This premium section is currently under construction. Check back soon for exciting updates!</p>
            </div>
        );
    };

    return (
        <div className="lecturer-dashboard-container">
            <aside className="lecturer-sidebar">
                <div className="lecturer-logo">
                    <div className="logo-icon">
                        <BookOpen size={20} color="white" />
                    </div>
                    <span>EduVault</span>
                </div>

                <nav className="lecturer-nav">
                    <div className="nav-section-title">Menu</div>
                    {navItems.map((item) => (
                        <div
                            key={item.id}
                            className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <div className="nav-item-content">
                                {item.icon}
                                <span>{item.label}</span>
                            </div>
                            {activeTab === item.id && <ChevronRight size={16} />}
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile-mini" onClick={() => navigate("/profile")}>
                        <div className="user-avatar">
                            {user.name ? user.name.charAt(0).toUpperCase() : "L"}
                        </div>
                        <div className="user-info">
                            <span className="user-name">{user.name || "Lecturer"}</span>
                            <span className="user-role">Lecturer</span>
                        </div>
                    </div>
                    <div className="logout-btn" onClick={handleLogout}>
                        <LogOut size={20} /> <span>Sign Out</span>
                    </div>
                </div>
            </aside>

            <main className="lecturer-main-content">
                <DashboardHeader
                    showSearch={true}
                    onSearchChange={(val) => console.log("Searching for:", val)}
                />

                <div className="lecturer-content-area">
                    <div className="content-header">
                        <h1>{navItems.find(item => item.id === activeTab)?.label}</h1>
                        <p>Welcome back, {user.name || "Professor"}! Here's what's happening today.</p>
                    </div>
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default LecturerDashboard;
