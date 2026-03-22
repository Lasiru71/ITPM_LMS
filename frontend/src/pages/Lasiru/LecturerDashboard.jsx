import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    BookOpen,
    PlusCircle,
    Star,
    Settings,
    LogOut,
    ChevronRight,
    Users,
    ChevronLeft,
    FilePlus,
    FileText
} from "lucide-react";

import { useToast } from "../../components/Lasiru/ToastProvider";
import DashboardHeader from "../../components/Lasiru/DashboardHeader";
import { useCourseStore } from "../../stores/courseStore";

// Sadeepa
import CreateAssignment from "../../components/sadeepa/CreateAssignment.jsx";
import CreateExam from "../../components/sadeepa/CreateExam.jsx";
import Reports from "../../components/sadeepa/Reports.jsx";

import "../../Styles/Lasiru/LecturerDashboard.css";

const LecturerDashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { courses, fetchCourses, isLoading } = useCourseStore();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    React.useEffect(() => {
        fetchCourses();
    }, []);

    const myCourses = courses.filter(
        c => c.instructorId === user.id || c.instructor === user.name
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        showToast("success", "Logged out successfully");
        navigate("/login");
    };

    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { id: "my-courses", label: "My Courses", icon: <BookOpen size={20} /> },
        { id: "create-course", label: "Create Course", icon: <PlusCircle size={20} /> },
        { id: "reviews", label: "Reviews", icon: <Star size={20} /> },
        { id: "create-assignment", label: "Create Assignment", icon: <FilePlus size={20} /> },
        { id: "create-exam", label: "Create Exam", icon: <FileText size={20} /> },
        { id: "reports", label: "Reports", icon: <FileText size={20} /> },
        { id: "settings", label: "Settings", icon: <Settings size={20} /> },
    ];

    const renderContent = () => {
        if (isLoading) return <div className="loading-state">Loading your dashboard...</div>;

        if (activeTab === "create-course") {
            return (
                <div className="empty-state-container">
                    <div className="empty-state">
                        <div className="empty-icon">
                            <PlusCircle size={40} />
                        </div>
                        <h2>Create Course</h2>
                        <p>This feature is currently being updated. Please check back later.</p>
                    </div>
                </div>
            );
        }

        // Sadeepa
        if (activeTab === "create-assignment") return <CreateAssignment />;
        if (activeTab === "create-exam") return <CreateExam />;
        if (activeTab === "reports") return <Reports />;

        if (activeTab === "dashboard") {
            return (
                <div className="dashboard-grid">
                    <div className="stat-cards">
                        <div className="stat-card">
                            <h3>Total Courses</h3>
                            <p>{myCourses.length}</p>
                        </div>
                    </div>
                    <div className="recent-activity">
                        <h2>My Courses</h2>
                        {myCourses.length > 0 ? (
                            <div className="course-compact-list">
                                {myCourses.map(course => (
                                    <div key={course.id || course._id} className="course-compact-item">
                                        <div className="course-thumb">
                                            <img src={course.thumbnail} alt={course.title} />
                                        </div>
                                        <div className="course-meta">
                                            <span className="font-bold">{course.title}</span>
                                            <span className="text-xs text-slate-500">{course.category}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-dashboard-state">
                                <p>No courses published yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        const activeItem = navItems.find(item => item.id === activeTab);
        return (
            <div className="empty-state-container">
                <div className="empty-state">
                    <div className="empty-icon">
                        {activeItem?.icon && React.cloneElement(activeItem.icon, { size: 40 })}
                    </div>
                    <h2>{activeItem?.label}</h2>
                    <p>This section is currently under development. Stay tuned for updates!</p>
                </div>
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
                    <div className="nav-section-title">Main</div>
                    <div 
                        className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
                        onClick={() => setActiveTab("dashboard")}
                    >
                        <div className="nav-item-content">
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </div>
                        {activeTab === "dashboard" && <ChevronRight size={14} opacity={0.5} />}
                    </div>

                    <div className="nav-section-title">Academic</div>
                    {navItems.filter(item => ["my-courses", "create-course", "reviews", "create-assignment", "create-exam", "reports"].includes(item.id)).map((item) => (
                        <div
                            key={item.id}
                            className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                            onClick={() => {
                                setActiveTab(item.id);
                                setCurrentPage(1);
                            }}
                        >
                            <div className="nav-item-content">
                                {item.icon}
                                <span>{item.label}</span>
                            </div>
                            {activeTab === item.id && <ChevronRight size={14} />}
                        </div>
                    ))}

                    <div className="nav-section-title">System</div>
                    <div 
                        className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
                        onClick={() => setActiveTab("settings")}
                    >
                        <div className="nav-item-content">
                            <Settings size={20} />
                            <span>Settings</span>
                        </div>
                        {activeTab === "settings" && <ChevronRight size={14} />}
                    </div>
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
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </div>
                </div>
            </aside>

            <main className="lecturer-main-content">
                <DashboardHeader title="Lecturer Dashboard" />
                
                <div className="lecturer-content-area">
                    <div className="content-header">
                        <h1>{navItems.find(i => i.id === activeTab)?.label}</h1>
                        <p>Welcome back, {user.name || "Educator"}! Continue managing your courses and materials.</p>
                    </div>
                    
                    <div className="lecturer-content-wrapper">
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LecturerDashboard;