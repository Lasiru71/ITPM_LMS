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
    ChevronLeft,
    Pencil,
    Trash2,
    Search,
    RefreshCw,
    MoreVertical,
    CheckCircle2,
    AlertCircle,
    Clock,
    DollarSign,
    GraduationCap,
    Globe,
    Eye
} from "lucide-react";


import { useToast } from "../../components/Lasiru/ToastProvider";
import DashboardHeader from "../../components/Lasiru/DashboardHeader";
import LecturerSettings from "../../components/Lasiru/LecturerSettings";
import CourseCreationForm from "../../components/features/Jeewani/CourseCreationForm";
import { useCourseStore } from "../../stores/courseStore";
import { getAllReviews } from "../../api/Jeewani/reviewApi";
import { getAllCourses } from "../../api/Jeewani/courseApi";
import { MOCK_COURSES } from "../../constants/Home/mockData";

import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

import "../../Styles/Lasiru/LecturerDashboard.css";

const LecturerDashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [currentPage, setCurrentPage] = useState(1);
    const [allCourses, setAllCourses] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const navigate = useNavigate();
    const { showToast } = useToast();

    const { courses, fetchCourses, deleteCourse, isLoading } = useCourseStore();

    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));

    useEffect(() => {
        fetchCourses();
        const loadReviews = async () => {
            const data = await getAllReviews();
            setReviews(data);
        };
        const fetchAllCourses = async () => {
            try {
                const customCourses = await getAllCourses();
                const combined = [
                    ...MOCK_COURSES.map(c => ({
                        ...c,
                        totalLessons: 12,
                        duration: '4h 30m',
                        language: 'English',
                        updatedAt: new Date(2024, 0, 1).toISOString() // Older date for mock
                    })), 
                    ...customCourses.map(c => ({
                        _id: c._id,
                        id: c.id,
                        title: c.title,
                        description: c.description,
                        shortDescription: c.shortDescription,
                        instructor: c.instructorName || c.instructor || 'Lecturer',
                        instructorId: c.instructorId,
                        price: c.price,
                        image: c.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
                        thumbnail: c.thumbnail,
                        rating: 4.5,
                        reviews: 10,
                        category: c.category || 'General',
                        level: c.level || 'Beginner',
                        totalLessons: c.totalLessons || 0,
                        duration: c.duration || '0m',
                        language: c.language || 'English',
                        updatedAt: c.updatedAt || c.lastUpdated || new Date().toISOString(),
                        modules: c.modules || []
                    }))
                ];
                setAllCourses(combined);
            } catch (error) {
                console.error("Error fetching all courses:", error);
                setAllCourses(MOCK_COURSES);
            }
        };
        loadReviews();
        fetchAllCourses();
    }, []);

    const handleRefresh = async () => {
        showToast("info", "Refreshing dashboard data...");
        try {
            await fetchCourses();
            const reviewData = await getAllReviews();
            setReviews(reviewData);
            
            const customCourses = await getAllCourses();
            const combined = [
                ...MOCK_COURSES.map(c => ({
                    ...c,
                    totalLessons: 12,
                    duration: '4h 30m',
                    language: 'English',
                    updatedAt: new Date(2024, 0, 1).toISOString()
                })), 
                ...customCourses.map(c => ({
                    _id: c._id,
                    id: c.id,
                    title: c.title,
                    description: c.description,
                    shortDescription: c.shortDescription,
                    instructor: c.instructorName || c.instructor || 'Lecturer',
                    instructorId: c.instructorId,
                    price: c.price,
                    image: c.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
                    thumbnail: c.thumbnail,
                    rating: 4.5,
                    reviews: 10,
                    category: c.category || 'General',
                    level: c.level || 'Beginner',
                    totalLessons: c.totalLessons || 0,
                    duration: c.duration || '0m',
                    language: c.language || 'English',
                    updatedAt: c.updatedAt || c.lastUpdated || new Date().toISOString(),
                    modules: c.modules || []
                }))
            ];
            setAllCourses(combined);
            showToast("success", "Dashboard updated");
        } catch (error) {
            showToast("error", "Refresh failed");
        }
    };

    const myCourses = allCourses
        .filter(c => c.instructorId === (user._id || user.id))
        .sort((a, b) => {
            const dateA = new Date(a.updatedAt || a.lastUpdated || 0);
            const dateB = new Date(b.updatedAt || b.lastUpdated || 0);
            return dateB - dateA;
        });



    const calcAvgRating = () => {
        if (!myCourses || myCourses.length === 0 || !reviews || reviews.length === 0) return "0.0";

        // Only include reviews that belong to this lecturer's courses
        const lecturerCourseIds = new Set(
            myCourses.flatMap(c => [String(c._id), String(c.id)].filter(Boolean))
        );

        const lecturerReviews = reviews.filter(review => {
            const reviewCourseId = String(review.courseId);
            return lecturerCourseIds.has(reviewCourseId);
        });

        if (lecturerReviews.length === 0) return "0.0";

        const sum = lecturerReviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
        return (sum / lecturerReviews.length).toFixed(1);
    };



    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        showToast("success", "Logged out successfully");
        navigate("/login");
    };

    const handleEditCourse = (courseId) => {
        navigate(`/edit-course/${courseId}`);
    };

    const handleDeleteCourse = async (courseId, courseTitle) => {
        if (window.confirm(`Are you sure you want to delete "${courseTitle}"?`)) {
            try {
                await deleteCourse(courseId);
                showToast("success", `Course "${courseTitle}" deleted successfully`);
            } catch (error) {
                showToast("error", "Failed to delete course");
            }
        }
    };

    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { id: "my-courses", label: "My Courses", icon: <BookOpen size={20} /> },
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
            // Sort courses by lastUpdated (newest first) or simply use reverse of array
            // Now showing all courses from the system as requested
            const filteredCourses = myCourses.filter(course => 
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                (course.category && course.category.toLowerCase().includes(searchQuery.toLowerCase()))
            );

            return (
                <div className="dashboard-grid-v2">

                    {/* STATS ROW */}
                    <div className="premium-stats-row">
                        <div className="premium-stat-card blue">
                            <div className="stat-icon-wrapper">
                                <BookOpen className="stat-icon" />
                            </div>
                            <div className="stat-data">
                                <div className="stat-value">
                                    {myCourses.length}
                                </div>
                                <div className="stat-label">Total Courses</div>
                            </div>
                        </div>

                        <div className="premium-stat-card orange">
                            <div className="stat-icon-wrapper">
                                <Clock className="stat-icon" />
                            </div>
                            <div className="stat-data">
                                <div className="stat-value text-ellipsis overflow-hidden whitespace-nowrap max-w-[150px]" title={myCourses.length > 0 ? myCourses[0].title : "No Course"}>
                                    {myCourses.length > 0 ? myCourses[0].title : "No Course"}
                                </div>
                                <div className="stat-label">Recently Updated</div>
                            </div>
                        </div>

                        <div className="premium-stat-card green">
                            <div className="stat-icon-wrapper">
                                <Star className="stat-icon" />
                            </div>
                            <div className="stat-data">
                                <div className="stat-value">{calcAvgRating()}</div>
                                <div className="stat-label">Avg. Rating</div>
                            </div>
                        </div>
                    </div>

                    {/* CONTROLS ROW */}
                    <div className="dashboard-controls-row">
                        <div className="search-container-v2">
                            <Search className="search-icon-v2" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search courses..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input-v2"
                            />
                        </div>
                        <div className="action-buttons-v2">
                            <Button className="btn-refresh" onClick={handleRefresh}>
                                <RefreshCw size={18} />
                                Refresh
                            </Button>
                        </div>
                    </div>

                    {/* COURSES TABLE */}
                    <div className="premium-table-container">
                        <table className="premium-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Level</th>
                                    <th>Price</th>
                                    <th>Lessons</th>
                                    <th>Duration</th>
                                    <th>Last Updated</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCourses.length > 0 ? (
                                    filteredCourses.map(course => {
                                        const isOwnCourse = course.instructorId === (user._id || user.id);
                                        return (
                                            <tr key={course._id || course.id}>
                                                <td>
                                                    <div className="table-course-info">
                                                        <div className="course-mini-thumb">
                                                            <img src={course.image || course.thumbnail} alt={course.title} />
                                                        </div>
                                                        <span className="course-name-text">{course.title}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <Badge className="category-badge">
                                                        {course.category || "General"}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <span className="level-text font-medium text-slate-600">{course.level || "Beginner"}</span>
                                                </td>
                                                <td>
                                                    <span className="price-text">Rs. {course.price?.toLocaleString() || "0"}</span>
                                                </td>
                                                <td>
                                                    <span className="module-count font-bold text-slate-700">
                                                        {course.totalLessons || course.modules?.length || 0}
                                                    </span>
                                                </td>
                                                <td>
                                                    <Badge className="duration-badge bg-blue-50 text-blue-600 border-none">
                                                        {course.duration || '0m'}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <span className="date-text">
                                                        {course.updatedAt ? new Date(course.updatedAt).toLocaleDateString() : 'N/A'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="table-actions">
                                                        <button 
                                                            className="action-btn view" 
                                                            title="View & Manage Content"
                                                            onClick={() => navigate(`/lecturer/courses/${course._id || course.id}`)}
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button 
                                                            className="action-btn edit" 
                                                            title="Edit"
                                                            onClick={() => handleEditCourse(course._id || course.id)}
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button 
                                                            className="action-btn delete" 
                                                            title="Delete"
                                                            onClick={() => handleDeleteCourse(course._id || course.id, course.title)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="empty-table-row">
                                            <div className="empty-table-state">
                                                <div className="empty-icon-v2">
                                                    <BookOpen size={48} />
                                                </div>
                                                <p>No courses found. Try a different search term or add new courses.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }

        if (activeTab === "reviews") {
            return (
                <div className="reviews-section animate-in fade-in duration-500">
                    <h2 className="text-2xl font-bold mb-6">Student Reviews</h2>
                    
                    {reviews.length === 0 ? (
                        <div className="empty-state text-center py-12">
                            <Star className="mx-auto mb-4 text-gray-300" size={48} />
                            <h3 className="text-lg font-medium text-gray-500">No reviews yet</h3>
                            <p className="text-sm text-gray-400">When students review your courses, they will appear here.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {reviews.map(review => {
                                const matchedCourse = myCourses.find(c => c._id === review.courseId || c.id === review.courseId);
                                const courseName = matchedCourse ? matchedCourse.title : "Unknown Course";
                                
                                return (
                                    <Card key={review._id} className="relative overflow-hidden">
                                        <CardHeader className="pb-2">
                                            <div className="flex gap-4 justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-lg">{review.studentName}</CardTitle>
                                                    <CardDescription className="text-xs">{courseName}</CardDescription>
                                                </div>
                                                <div className="flex gap-1 text-amber-500 shrink-0">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star 
                                                            key={i} 
                                                            size={14} 
                                                            className={i < review.rating ? "fill-amber-500" : "fill-transparent text-gray-300"} 
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-gray-600 mt-2 italic">"{review.comment}"</p>
                                            <p className="text-xs text-gray-400 mt-4 text-right">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </p>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            );
        }

        if (activeTab === "settings") {
            return (
                <div className="settings-section animate-in fade-in duration-500">
                    <LecturerSettings onProfileUpdate={setUser} />
                </div>
            );
        }

        if (activeTab === "my-courses") {
            return (
                <div className="my-courses-section animate-in fade-in duration-500">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">My Published Courses</h2>
                        <Button 
                            className="bg-emerald-500 text-white flex items-center gap-2"
                            onClick={() => setActiveTab("create-course")}
                        >
                            <PlusCircle size={18} /> Create New Course
                        </Button>
                    </div>

                    {myCourses.length === 0 ? (
                        <div className="empty-state text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                            <BookOpen className="mx-auto mb-4 text-gray-300" size={48} />
                            <h3 className="text-xl font-bold text-gray-700">No courses yet</h3>
                            <p className="text-gray-500 mt-2">You haven't published any courses yet. Start by creating your first one!</p>
                            <Button
                                className="mt-8 bg-emerald-500 text-white"
                                onClick={() => setActiveTab("create-course")}
                            >
                                Create Your First Course
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {myCourses.map(course => (
                                <Card 
                                    key={course._id} 
                                    className="overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                                    onClick={() => navigate(`/lecturer/courses/${course._id || course.id}`)}
                                >
                                    <div className="aspect-video relative group">
                                        <img
                                            src={course.image || course.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop"}
                                            alt={course.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <Badge className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur-md">
                                            {course.category || "General"}
                                        </Badge>
                                    </div>

                                    <CardHeader className="pb-2">
                                        <CardTitle className="leading-tight">{course.title}</CardTitle>
                                        <CardDescription className="line-clamp-2 mt-1">
                                            {course.shortDescription || course.description || "No description provided."}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="pt-0">
                                         <div className="flex justify-between items-center mt-4">
                                            <span className="text-xl font-black text-emerald-600">
                                                ${course.price || "Free"}
                                            </span>
                                            <div className="flex flex-col items-end">
                                                <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                                                    <Star size={14} className="fill-amber-500" />
                                                    4.5
                                                </div>
                                                {course.updatedAt && (
                                                    <span className="text-[10px] text-slate-400 mt-1">
                                                        Updated: {new Date(course.updatedAt).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-50">
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <GraduationCap size={16} className="text-emerald-500" />
                                                <span className="text-xs font-semibold">{course.level || 'Beginner'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <BookOpen size={16} className="text-emerald-500" />
                                                <span className="text-xs font-semibold">{course.totalLessons || '0'} Lessons</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Clock size={16} className="text-emerald-500" />
                                                <span className="text-xs font-semibold">{course.duration || '0m'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Globe size={16} className="text-emerald-500" />
                                                <span className="text-xs font-semibold">{course.language || 'English'}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
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
                        <div className="user-avatar rounded-full overflow-hidden flex items-center justify-center bg-gray-200" style={{ width: '40px', height: '40px' }}>
                            {user?.profileImage ? (
                                <img src={user.profileImage} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span>{user?.name?.charAt(0) || "L"}</span>
                            )}
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
                    user={user}
                />

                <div className="lecturer-content-area">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default LecturerDashboard;