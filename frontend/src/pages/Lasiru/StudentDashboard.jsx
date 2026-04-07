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
    FileText,
    Calendar,
    Clock,
    CheckCircle,
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
        { id: "assignments", label: "Assignments", icon: <FileText size={20} /> },
        { id: "announcements", label: "Announcements", icon: <Bell size={20} /> },
        { id: "certificates", label: "Certificates", icon: <Award size={20} /> },
        { id: "reviews", label: "My Reviews", icon: <MessageSquare size={20} /> },
        { id: "settings", label: "Settings", icon: <Settings size={20} /> },
    ];

    const [courses, setCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [assignmentsState, setAssignmentsState] = useState({ available: [], pending: [], completed: [] });
    const [announcements, setAnnouncements] = useState([]);

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

        const fetchAnnouncements = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/announcements`);
                if (res.ok) setAnnouncements(await res.json());
            } catch (err) { console.error("Error fetching announcements", err); }
        };

        const fetchAssignments = async () => {
             try {
                const studentId = user._id || user.id;
                if (!studentId) return;
                const res = await fetch(`http://localhost:5000/api/assignments/student?studentId=${studentId}`);
                if (res.ok) setAssignmentsState(await res.json());
             } catch (err) { console.error("Error fetching assignments", err); }
        };

        fetchCourses();
        fetchMyCourses();
        fetchAnnouncements();
        fetchAssignments();
    }, [user._id, user.id]);

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

        if (activeTab === "announcements") {
            return (
                <div className="animate-in fade-in duration-500 max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Bell className="text-blue-500"/> Recent Announcements</h2>
                        {announcements.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">No announcements at the moment.</div>
                        ) : (
                            <div className="space-y-4">
                                {announcements.map((ann, idx) => (
                                    <div key={ann._id || idx} className="p-4 border border-blue-50 rounded-xl bg-blue-50/30 hover:bg-blue-50 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-gray-800 text-lg">{ann.title}</h3>
                                            <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100">
                                                {new Date(ann.createdAt || Date.now()).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm whitespace-pre-wrap">{ann.content || ann.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        if (activeTab === "assignments") {
            return (
                <div className="animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4"><Clock size={24}/></div>
                            <div className="text-3xl font-bold text-gray-800 mb-1">{assignmentsState.pending?.length || 0}</div>
                            <div className="text-sm text-gray-500 font-medium tracking-wide">PENDING ASSIGNMENTS</div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4"><CheckCircle size={24}/></div>
                            <div className="text-3xl font-bold text-gray-800 mb-1">{assignmentsState.completed?.length || 0}</div>
                            <div className="text-sm text-gray-500 font-medium tracking-wide">COMPLETED ASSIGNMENTS</div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4"><FileText size={24}/></div>
                            <div className="text-3xl font-bold text-gray-800 mb-1">{assignmentsState.available?.length || 0}</div>
                            <div className="text-sm text-gray-500 font-medium tracking-wide">AVAILABLE QUIZZES</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="border-b border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <h2 className="text-xl font-bold text-gray-800">Your Tasks</h2>
                        </div>
                        <div className="p-6">
                            {(!assignmentsState.pending?.length && !assignmentsState.completed?.length && !assignmentsState.available?.length) ? (
                                <div className="text-center py-10 flex flex-col items-center justify-center gap-4">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                                        <FileText size={32}/>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">No Assignments Yet</h3>
                                    <p className="text-gray-500 text-sm max-w-sm">You haven't been assigned any tasks or quizzes yet. Check back later!</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {[...(assignmentsState.pending || []).map(a => ({...a, status: 'pending'})), ...(assignmentsState.completed || []).map(a => ({...a, status: 'completed'}))].map((assignment, idx) => (
                                        <div key={assignment._id || idx} className="flex flex-col md:flex-row items-center justify-between p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow bg-gray-50/50">
                                            <div className="flex items-center gap-4 w-full md:w-auto mb-4 md:mb-0">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${assignment.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                                    {assignment.status === 'completed' ? <CheckCircle size={24}/> : <FileText size={24}/>}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-800 text-lg mb-1">{assignment.title}</h4>
                                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1"><Clock size={14}/> {new Date(assignment.deadline).toLocaleDateString()}</span>
                                                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-200 text-gray-700">{assignment.type || 'Assignment'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="w-full md:w-auto flex justify-end">
                                                {assignment.status === 'completed' ? (
                                                    <div className="text-right">
                                                        <div className="text-sm font-semibold text-green-600 mb-1">Submitted</div>
                                                        <div className="text-xs text-gray-500">Grade: {assignment.submission?.grade || 'Pending'} ({assignment.submission?.marks || 0}%)</div>
                                                    </div>
                                                ) : (
                                                    <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
                                                        Start Attempt
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
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
