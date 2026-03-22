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
    User,
    Users,
    Layers,
    ChevronLeft,
    CheckCircle2
} from "lucide-react";
import { useToast } from "../../components/Lasiru/ToastProvider";
import DashboardHeader from "../../components/Lasiru/DashboardHeader";
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
    const { courses, fetchCourses, isLoading } = useCourseStore();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    React.useEffect(() => {
        fetchCourses();
    }, []);

    const myCourses = courses.filter(c => c.instructorId === user.id || c.instructor === user.name);

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
        if (isLoading) return <div className="loading-state">Loading your dashboard...</div>;

        if (activeTab === "create-course") {
            return (
                <div className="empty-state-container">
                    <div className="empty-state">
                        <h2>Create Course</h2>
                        <p>This feature is currently being updated. Please check back later.</p>
                    </div>
                </div>
            );
        }

        if (activeTab === "dashboard") {
            const itemsPerPage = 3;
            const totalPages = Math.ceil(myCourses.length / itemsPerPage);
            const paginatedCourses = myCourses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

            return (
                <div className="dashboard-grid">
                    <div className="stat-cards">
                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">Total Courses</CardTitle>
                                <BookOpen className="h-5 w-5 text-emerald-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black text-slate-900">{myCourses.length}</div>
                            </CardContent>
                        </Card>
                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">Total Students</CardTitle>
                                <Users className="h-5 w-5 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black text-slate-900">428</div>
                            </CardContent>
                        </Card>
                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-500">Avg. Rating</CardTitle>
                                <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black text-slate-900">4.8</div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="recent-activity mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Recent Courses</h2>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">Page {currentPage} / {Math.max(1, totalPages)}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {paginatedCourses.length > 0 ? (
                                paginatedCourses.map(course => (
                                    <Card key={course.id || course._id} className="course-card-premium group overflow-hidden border-slate-100 hover:shadow-xl transition-all duration-300">
                                        <div className="card-image aspect-video relative overflow-hidden">
                                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            <Badge className="absolute top-3 right-3 bg-white/95 text-slate-900 border-none shadow-sm">{course.category}</Badge>
                                        </div>
                                        <CardHeader className="p-5 pb-0">
                                            <CardTitle className="text-base font-bold text-slate-800 line-clamp-1">{course.title}</CardTitle>
                                            <CardDescription className="text-xs line-clamp-2 mt-2">{course.shortDescription}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-5 flex items-center justify-between border-t mt-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-emerald-600 font-black text-lg">${course.price}</span>
                                            </div>
                                            <Button variant="ghost" size="sm" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl">Edit</Button>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-full border-2 border-dashed border-slate-100 rounded-3xl p-12 text-center text-slate-400">
                                    <PlusCircle size={32} className="mx-auto mb-4 opacity-20" />
                                    <p className="font-bold">No courses published yet.</p>
                                </div>
                            )}
                        </div>

                        {totalPages > 1 && (
                            <div className="pagination flex justify-center items-center gap-4 mt-8">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                    className="rounded-xl font-bold"
                                >
                                    <ChevronLeft size={16} className="mr-1" /> Previous
                                </Button>
                                <div className="flex gap-1">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`size-8 rounded-lg text-xs font-bold transition-all ${currentPage === i + 1 ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    className="rounded-xl font-bold"
                                >
                                    Next <ChevronRight size={16} className="ml-1" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        // Placeholder for other tabs (Reviews, Settings, MyCourse)
        const activeItem = navItems.find(item => item.id === activeTab);
        return (
            <div className="empty-state-container animate-in fade-in duration-500">
                <div className="empty-state">
                    <div className="empty-icon">
                        {activeItem?.icon && React.cloneElement(activeItem.icon, { size: 40 })}
                    </div>
                    <h2>{activeItem?.label}</h2>
                    <p>This section is currently under development. Stay tuned for updates!</p>
                    {activeTab === "my-courses" && (
                        <Button className="mt-8 bg-emerald-500 hover:bg-emerald-600 border-none px-10 rounded-xl text-white font-bold" onClick={() => setActiveTab("create-course")}>
                            Create Your First Course
                        </Button>
                    )}
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
                    {navItems.map((item) => (
                        <button
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
                            {activeTab === item.id && <ChevronRight size={14} opacity={0.5} />}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile-mini">
                        <div className="user-avatar">
                            {user.name?.charAt(0) || "L"}
                        </div>
                        <div className="user-info">
                            <span className="user-name">{user.name || "Lecturer"}</span>
                            <span className="user-role uppercase tabular-nums">Lecturer</span>
                        </div>
                    </div>
                    <button className="logout-btn w-full border-none bg-transparent" onClick={handleLogout}>
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="lecturer-main-content">
                <DashboardHeader title={navItems.find(i => i.id === activeTab)?.label} />
                <div className="lecturer-content-area">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default LecturerDashboard;
