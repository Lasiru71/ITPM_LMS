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

    const renderContent = () => {
        return (
            <div className="dashboard-placeholder">
                <div className="placeholder-icon">
                    {navItems.find(item => item.id === activeTab)?.icon}
                </div>
                <h2>{navItems.find(item => item.id === activeTab)?.label}</h2>
                <p>This section is under development.</p>
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
