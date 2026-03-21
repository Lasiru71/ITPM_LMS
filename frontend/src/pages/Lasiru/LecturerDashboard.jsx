import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    BookOpen,
    PlusCircle,
    Star,
    Settings,
    LogOut
} from "lucide-react";

import { useToast } from "../../components/Lasiru/ToastProvider";
import DashboardHeader from "../../components/Lasiru/DashboardHeader";
import CourseCreationForm from "../../components/features/Jeewani/CourseCreationForm";
import { useCourseStore } from "../../stores/courseStore";

import "../../Styles/Lasiru/LecturerDashboard.css";

const LecturerDashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { courses, fetchCourses, isLoading } = useCourseStore();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        fetchCourses();
    }, []);

    const myCourses = courses.filter(
        c => c.instructorId === user.id || c.instructor === user.name
    );

    const handleLogout = () => {
        localStorage.clear();
        showToast("success", "Logged out successfully");
        navigate("/login");
    };

    // ✅ ONLY YOUR NAV ITEMS
    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { id: "my-courses", label: "My Courses", icon: <BookOpen size={20} /> },
        { id: "create-course", label: "Create Course", icon: <PlusCircle size={20} /> },
        { id: "reviews", label: "Reviews", icon: <Star size={20} /> },
        { id: "settings", label: "Settings", icon: <Settings size={20} /> },
    ];

    const renderContent = () => {
        if (isLoading) return <div>Loading...</div>;

        // 👉 CREATE COURSE
        if (activeTab === "create-course") {
            return <CourseCreationForm onSuccess={() => setActiveTab("dashboard")} />;
        }

        // 👉 DASHBOARD + MY COURSES
        if (activeTab === "dashboard" || activeTab === "my-courses") {
            return (
                <div style={{ padding: "20px" }}>
                    <h2>My Courses ({myCourses.length})</h2>

                    {myCourses.length > 0 ? (
                        myCourses.map(course => (
                            <div
                                key={course.id || course._id}
                                style={{
                                    padding: "10px",
                                    marginTop: "10px",
                                    border: "1px solid #ddd",
                                    borderRadius: "8px"
                                }}
                            >
                                <h4>{course.title}</h4>
                                <p>{course.shortDescription}</p>
                            </div>
                        ))
                    ) : (
                        <p>No courses yet</p>
                    )}
                </div>
            );
        }

        // 👉 OTHER TABS
        return (
            <div style={{ padding: "20px" }}>
                <h2>{navItems.find(i => i.id === activeTab)?.label}</h2>
                <p>Section under development</p>
            </div>
        );
    };

    return (
        <div className="lecturer-dashboard-container">
            {/* SIDEBAR */}
            <aside className="lecturer-sidebar">
                <div className="lecturer-logo">
                    <BookOpen size={20} />
                    <span>EduVault</span>
                </div>

                <nav>
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            className={activeTab === item.id ? "active" : ""}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <button onClick={handleLogout}>
                    <LogOut size={18} /> Logout
                </button>
            </aside>

            {/* MAIN CONTENT */}
            <main>
                <DashboardHeader
                    title={navItems.find(i => i.id === activeTab)?.label}
                />
                {renderContent()}
            </main>
        </div>
    );
};

export default LecturerDashboard;