import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    BookOpen,
    Search,
    Award,
    Settings,
    LogOut,
    Bell,
    ChevronRight,
    User,
    PlayCircle
} from "lucide-react";
import { useToast } from "../../components/Lasiru/ToastProvider";
import DashboardHeader from "../../components/Lasiru/DashboardHeader";
import "../../Styles/Lasiru/StudentDashboard.css";

const StudentDashboard = () => {
    const [activeTab, setActiveTab] = useState("my-learning");
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
        { id: "my-learning", label: "MyLearning", icon: <PlayCircle size={20} /> },
        { id: "browse", label: "Browse Courses", icon: <Search size={20} /> },
        { id: "certificates", label: "Certificates", icon: <Award size={20} /> },
        { id: "settings", label: "Settings", icon: <Settings size={20} /> },
    ];

    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    React.useEffect(() => {
        const fetchCourses = async () => {
            const { MOCK_COURSES } = await import("../../constants/Home/mockData");
            const { getAllCourses } = await import("../../api/Jeewani/courseApi");
            const customCourses = await getAllCourses();
            const combined = [...MOCK_COURSES, ...customCourses.map(c => ({
                id: c._id,
                title: c.title,
                instructor: c.instructorName || 'Lecturer',
                price: c.price,
                image: c.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
                thumbnail: c.thumbnail,
                rating: 4.5,
                category: c.category || 'General'
            }))];
            setCourses(combined);
        };
        fetchCourses();
    }, []);

    const filteredCourses = courses.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderContent = () => {
        if (activeTab === "browse") {
            return (
                <div className="browse-courses-section animate-in fade-in duration-500">
                    <div className="search-bar-container mb-8">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="text"
                                placeholder="Search for courses, categories..."
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredCourses.map(course => (
                            <div key={course.id} className="course-card bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="aspect-video relative">
                                    <img src={course.image || course.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop"} alt={course.title} className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                                        {course.category}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-800 line-clamp-1">{course.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{course.instructor}</p>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="font-bold text-blue-600">${course.price}</span>
                                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                                            Enroll Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

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
        <div className="student-dashboard-container">
            <aside className="student-sidebar">
                <div className="student-logo">
                    <div className="logo-icon">
                        <BookOpen size={20} color="white" />
                    </div>
                    <span>EduVault</span>
                </div>

                <nav className="student-nav">
                    <div className="nav-section-title">Learning</div>
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
                        <div className="user-avatar" style={{ background: '#3b82f6' }}>
                            {user.name ? user.name.charAt(0).toUpperCase() : "S"}
                        </div>
                        <div className="user-info">
                            <span className="user-name">{user.name || "Student"}</span>
                            <span className="user-role">Student</span>
                        </div>
                    </div>
                    <div className="logout-btn" onClick={handleLogout}>
                        <LogOut size={20} /> <span>Sign Out</span>
                    </div>
                </div>
            </aside>

            <main className="student-main-content">
                <DashboardHeader 
                    showSearch={true} 
                    onSearchChange={(val) => console.log("Searching for:", val)} 
                />

                <div className="student-content-area">
                    <div className="content-header">
                        <h1>{navItems.find(item => item.id === activeTab)?.label}</h1>
                        <p>Welcome back, {user.name || "Learner"}! Continue where you left off.</p>
                    </div>
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
