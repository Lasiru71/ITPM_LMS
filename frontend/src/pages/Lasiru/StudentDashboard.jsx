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
    PlayCircle,
    MessageSquare
} from "lucide-react";
import { useToast } from "../../components/Lasiru/ToastProvider";
import { useLogout } from "../../hooks/Lasiru/useLogout";
import DashboardHeader from "../../components/Lasiru/DashboardHeader";
import CourseCard from "../../components/Home/CourseCard";
import ReviewsPage from "./ReviewsPage.jsx";
import "../../Styles/Lasiru/StudentDashboard.css";

const StudentDashboard = () => {
    const [activeTab, setActiveTab] = useState("my-learning");
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { handleLogout } = useLogout();
    const user = JSON.parse(localStorage.getItem("user") || "{}");


    const navItems = [
        { id: "my-learning", label: "MyLearning", icon: <PlayCircle size={20} /> },
        { id: "browse", label: "Browse Courses", icon: <Search size={20} /> },
        { id: "certificates", label: "Certificates", icon: <Award size={20} /> },
        { id: "reviews", label: "My Reviews", icon: <MessageSquare size={20} /> },
        { id: "settings", label: "Settings", icon: <Settings size={20} /> },
    ];

    const [courses, setCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchMyCourses = async () => {
        try {
            const studentId = user._id || user.id;
            let enrolled = [];
            
            if (studentId) {
                const response = await fetch(`http://localhost:5000/api/enrollments/student/${studentId}`);
                if (response.ok) {
                    enrolled = await response.json();
                }
            }

            // Fallback to mock data for presentation if no real enrollments exist
            if (enrolled.length === 0) {
                const { MOCK_COURSES } = await import("../../constants/Home/mockData");
                enrolled = MOCK_COURSES.slice(0, 2).map(c => ({
                    _id: c.id,
                    title: c.title,
                    instructor: c.instructor,
                    thumbnail: c.image || c.thumbnail,
                    category: c.category
                }));
            }
            
            setMyCourses(enrolled);
        } catch (error) {
            console.error("Error fetching my courses:", error);
        }
    };

    React.useEffect(() => {
        const fetchCourses = async () => {
            const { MOCK_COURSES } = await import("../../constants/Home/mockData");
            const { getAllCourses } = await import("../../api/Jeewani/courseApi");
            const customCourses = await getAllCourses();
            const mappedRealCourses = customCourses.map(c => ({
                ...c,
                id: c._id || c.id,
                title: c.title,
                instructor: c.instructorName || c.instructor || 'Lecturer',
                price: c.price || 'Free',
                image: c.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
                thumbnail: c.thumbnail,
                rating: c.rating || 4.5,
                reviews: c.reviews || 10,
                category: c.category || 'General',
                level: c.level || 'All Levels',
                isBestseller: true,
                isNew: true
            }));

            const combined = [
                ...mappedRealCourses,
                ...MOCK_COURSES.filter(
                    (mock) => !mappedRealCourses.some((real) => real.id === mock.id)
                )
            ];
            setCourses(combined);
        };
        fetchCourses();
        fetchMyCourses();
    }, [user._id]);

    const handleEnroll = async (courseId, price) => {
        try {
            const studentId = user._id;
            if (!studentId) {
                showToast("error", "Please login to enroll");
                return;
            }

            const response = await fetch("http://localhost:5000/api/enrollments/enroll", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    studentId,
                    courseId,
                    paymentAmount: price,
                }),
            });

            if (response.ok) {
                showToast("success", "Enrolled successfully!");
                fetchMyCourses(); // Refresh my-learning
                setActiveTab("my-learning");
            } else {
                const data = await response.json();
                showToast("error", data.message || "Failed to enroll");
            }
        } catch (error) {
            showToast("error", "Error enrolling in course");
        }
    };

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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                        {filteredCourses.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                </div>
            );
        }

        if (activeTab === "my-learning") {
            return (
                <div className="my-learning-container animate-in fade-in duration-500">
                    {/* Learning Stats Bar */}
                    <div className="learning-stats-grid mb-8">
                        <div className="stat-card">
                            <div className="stat-icon bg-blue-50 text-blue-600">
                                <PlayCircle size={20} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">{myCourses.length}</span>
                                <span className="stat-label">Enrolled Courses</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon bg-green-50 text-green-600">
                                <Award size={20} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">0</span>
                                <span className="stat-label">Certificates Earned</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon bg-purple-50 text-purple-600">
                                <BookOpen size={20} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-value">0</span>
                                <span className="stat-label">Hours Learned</span>
                            </div>
                        </div>
                    </div>

                    <div className="section-header flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Your Courses</h2>
                        <div className="flex gap-2">
                            <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">All Courses</span>
                        </div>
                    </div>

                    {myCourses.length === 0 ? (
                        <div className="empty-state-modern">
                            <div className="empty-illustration">
                                <Search size={64} className="text-blue-100" />
                            </div>
                            <h3>Start your learning journey</h3>
                            <p>You haven't enrolled in any courses yet. Explore our library to find something that interests you.</p>
                            <button
                                onClick={() => setActiveTab("browse")}
                                className="browse-btn"
                            >
                                Browse All Courses
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    ) : (
                        <div className="my-courses-grid">
                            {myCourses.map(course => (
                                <div key={course._id} className="modern-course-card">
                                    <div className="card-media">
                                        <img src={course.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop"} alt={course.title} />
                                        <div className="media-overlay">
                                            <button className="play-btn" onClick={() => navigate(`/lecturer/courses/${course._id}`)}>
                                                <PlayCircle size={32} />
                                            </button>
                                        </div>
                                        <div className="category-tag">{course.category || 'General'}</div>
                                    </div>
                                    <div className="card-content">
                                        <div className="card-header">
                                            <h3 title={course.title}>{course.title}</h3>
                                            <p>{course.instructor || 'EduVault Instructor'}</p>
                                        </div>

                                        <div className="progress-section">
                                            <div className="progress-info">
                                                <span>Overall Progress</span>
                                                <span className="percent">0%</span>
                                            </div>
                                            <div className="progress-track">
                                                <div className="progress-fill" style={{ width: '0%' }}></div>
                                            </div>
                                        </div>

                                        <div className="card-footer">
                                            <button
                                                onClick={() => navigate(`/lecturer/courses/${course._id}`)}
                                                className="continue-btn"
                                            >
                                                Continue Learning
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        if (activeTab === "reviews") {
            return <ReviewsPage />;
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
