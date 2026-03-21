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

// Jeewani
import CourseCreationForm from "../../components/features/Jeewani/CourseCreationForm";
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
        { id: "my-courses", label: "MyCourse", icon: <BookOpen size={20} /> },
        { id: "create-course", label: "Create Course", icon: <PlusCircle size={20} /> },
        { id: "reviews", label: "Reviews", icon: <Star size={20} /> },
        { id: "create-assignment", label: "Create Assignment", icon: <FilePlus size={20} /> },
        { id: "create-exam", label: "Create Exam", icon: <FileText size={20} /> },
        { id: "reports", label: "Reports", icon: <FileText size={20} /> },
        { id: "settings", label: "Settings", icon: <Settings size={20} /> },
    ];

    const renderContent = () => {
        if (isLoading) return <div>Loading...</div>;

        // Jeewani
        if (activeTab === "create-course") {
            return <CourseCreationForm onSuccess={() => setActiveTab("dashboard")} />;
        }

        // Sadeepa
        if (activeTab === "create-assignment") return <CreateAssignment />;
        if (activeTab === "create-exam") return <CreateExam />;
        if (activeTab === "reports") return <Reports />;

        // Dashboard
        if (activeTab === "dashboard") {
            return (
                <div>
                    <h2>My Courses ({myCourses.length})</h2>
                    {myCourses.length > 0 ? (
                        myCourses.map(course => (
                            <div key={course.id || course._id}>
                                <p>{course.title}</p>
                            </div>
                        ))
                    ) : (
                        <p>No courses yet</p>
                    )}
                </div>
            );
        }

        const activeItem = navItems.find(item => item.id === activeTab);

        return (
            <div>
                <h2>{activeItem?.label}</h2>
                <p>Section under development</p>
            </div>
        );
    };

    return (
        <div className="lecturer-dashboard-container">
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
                            onClick={() => {
                                setActiveTab(item.id);
                                setCurrentPage(1);
                            }}
                        >
                            {item.icon} {item.label}
                        </button>
                    ))}
                </nav>

                <button onClick={handleLogout}>
                    <LogOut size={18} /> Logout
                </button>
            </aside>

            <main>
                <DashboardHeader title={navItems.find(i => i.id === activeTab)?.label} />
                {renderContent()}
            </main>
        </div>
    );
};

export default LecturerDashboard;