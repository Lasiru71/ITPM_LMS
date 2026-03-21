import React, { useState, useEffect } from "react";
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
    ChevronLeft
} from "lucide-react";

import { useToast } from "../../components/Lasiru/ToastProvider";
import DashboardHeader from "../../components/Lasiru/DashboardHeader";
import CourseCreationForm from "../../components/features/Jeewani/CourseCreationForm";
import { useCourseStore } from "../../stores/courseStore";

import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

import "../../Styles/Lasiru/LecturerDashboard.css";

const LecturerDashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [currentPage, setCurrentPage] = useState(1);

    const navigate = useNavigate();
    const { showToast } = useToast();

    const { courses, fetchCourses, isLoading, deleteCourse } = useCourseStore();

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        fetchCourses();
    }, []);

    const myCourses = courses;

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        showToast("success", "Logged out successfully");
        navigate("/login");
    };

    const handleEdit = (course) => {
        navigate(`/edit-course/${course._id}`);
    };

    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete?");
        if (!confirm) return;

        await deleteCourse(id);
        showToast("success", "Course deleted");
    };

    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { id: "my-courses", label: "MyCourse", icon: <BookOpen size={20} /> },
        { id: "create-course", label: "Create Course", icon: <PlusCircle size={20} /> },
        { id: "reviews", label: "Reviews", icon: <Star size={20} /> },
        { id: "settings", label: "Settings", icon: <Settings size={20} /> },
    ];

    const renderContent = () => {
        if (isLoading) return <div className="loading-state">Loading your dashboard...</div>;

        if (activeTab === "create-course") {
            return (
                <CourseCreationForm
                    onSuccess={() => {
                        fetchCourses();
                        setActiveTab("dashboard");
                    }}
                />
            );
        }

        if (activeTab === "dashboard") {
            const itemsPerPage = 3;
            const totalPages = Math.ceil(myCourses.length / itemsPerPage);

            const paginatedCourses = myCourses.slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
            );

            return (
                <div className="dashboard-grid">

                    {/* STATS */}
                    <div className="stat-cards">
                        <Card>
                            <CardHeader className="flex justify-between pb-2">
                                <CardTitle className="text-sm text-gray-500">Total Courses</CardTitle>
                                <BookOpen className="h-5 w-5 text-emerald-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black">{myCourses.length}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex justify-between pb-2">
                                <CardTitle className="text-sm text-gray-500">Total Students</CardTitle>
                                <Users className="h-5 w-5 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black">428</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex justify-between pb-2">
                                <CardTitle className="text-sm text-gray-500">Avg. Rating</CardTitle>
                                <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black">4.8</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* COURSES */}
                    <div className="recent-activity mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Recent Courses</h2>
                            <span className="text-xs text-gray-400">
                                Page {currentPage} / {Math.max(1, totalPages)}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {paginatedCourses.length > 0 ? (
                                paginatedCourses.map(course => (
                                    <Card key={course._id}>
                                        <div className="aspect-video relative">
                                            <img
                                                src={course.thumbnail || "https://via.placeholder.com/300"}
                                                alt={course.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <Badge className="absolute top-2 right-2">
                                                {course.category || "General"}
                                            </Badge>
                                        </div>

                                        <CardHeader>
                                            <CardTitle>{course.title}</CardTitle>
                                            <CardDescription>
                                                {course.shortDescription}
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent className="flex justify-between items-center">
                                            <span className="text-green-600 font-bold">
                                                ${course.price}
                                            </span>

                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    className="bg-blue-500 text-white"
                                                    onClick={() => handleEdit(course)}
                                                >
                                                    Edit
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(course._id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-full text-center text-gray-400">
                                    No courses published yet.
                                </div>
                            )}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center gap-4 mt-6">
                                <Button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                >
                                    <ChevronLeft size={16} /> Prev
                                </Button>

                                <Button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                >
                                    Next <ChevronRight size={16} />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        // ✅ NEW EMPTY STATE UI
        const activeItem = navItems.find(item => item.id === activeTab);

        return (
            <div className="empty-state-container animate-in fade-in duration-500">
                <div className="empty-state text-center">
                    <div className="empty-icon mb-4">
                        {activeItem?.icon && React.cloneElement(activeItem.icon, { size: 40 })}
                    </div>

                    <h2 className="text-xl font-bold">{activeItem?.label}</h2>
                    <p className="text-gray-500 mt-2">
                        This section is currently under development. Stay tuned!
                    </p>

                    {activeTab === "my-courses" && (
                        <Button
                            className="mt-6 bg-emerald-500 text-white"
                            onClick={() => setActiveTab("create-course")}
                        >
                            Create Your First Course
                        </Button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="lecturer-dashboard-container">

            {/* SIDEBAR */}
            <aside className="lecturer-sidebar">

                <div className="lecturer-logo flex items-center gap-2">
                    <BookOpen size={20} color="white" />
                    <span>EduVault</span>
                </div>

                <nav className="lecturer-nav">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            className={`nav-item ${activeTab === item.id ? "active" : ""}`}
                            onClick={() => {
                                setActiveTab(item.id);
                                setCurrentPage(1);
                            }}
                        >
                            <div className="nav-item-content flex items-center gap-2">
                                {item.icon}
                                <span>{item.label}</span>
                            </div>

                            {activeTab === item.id && (
                                <ChevronRight size={14} opacity={0.5} />
                            )}
                        </button>
                    ))}
                </nav>

                {/* ✅ NEW FOOTER */}
                <div className="sidebar-footer mt-auto p-4">
                    <div className="user-profile-mini flex items-center gap-3 mb-3">
                        <div className="user-avatar">
                            {user.name?.charAt(0) || "L"}
                        </div>
                        <div>
                            <div className="font-semibold">{user.name || "Lecturer"}</div>
                            <div className="text-xs text-gray-400">Lecturer</div>
                        </div>
                    </div>

                    <button className="logout-btn w-full" onClick={handleLogout}>
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* MAIN */}
            <main className="lecturer-main-content">
                <DashboardHeader
                    title={navItems.find(i => i.id === activeTab)?.label}
                />

                <div className="lecturer-content-area">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default LecturerDashboard;