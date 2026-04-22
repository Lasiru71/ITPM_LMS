import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Globe,
    Eye,
    Users,
    Calendar,
    CheckCircle,
    XCircle,
    RefreshCw,
    Clock,
    GraduationCap,
    LayoutDashboard,
    BookOpen,
    PlusCircle,
    Star,
    Settings,
    LogOut,
    ChevronRight,
    Search,
    User,
    QrCode,
    Activity,
    Pencil,
    Trash2,
    MessageSquare,
    CornerUpRight,
    FileText
} from "lucide-react";

import { useToast } from "../../components/Lasiru/ToastProvider";
import { useLogout } from "../../hooks/Lasiru/useLogout";
import DashboardHeader from "../../components/Lasiru/DashboardHeader";
import LecturerQRManager from "../../components/Lasiru/LecturerQRManager";
import AttendanceView from "../../components/Lasiru/AttendanceView";
import api from "../../services/api";
import LecturerSettings from "../../components/Lasiru/LecturerSettings";
import { getAllCourses, deleteCourse } from '../../api/Jeewani/courseApi';
import { getAllReviews, addAdminReply, deleteReview as deleteReviewApi } from '../../api/Lasiru/reviewApi';
import CourseCreationForm from "../../components/features/Jeewani/CourseCreationForm";
import { useCourseStore } from "../../stores/courseStore";
import MaterialUpload from "../../components/sadeepa/MaterialUpload";

import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

import "../../Styles/Lasiru/LecturerDashboard.css";

const LecturerDashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [currentPage, setCurrentPage] = useState(1);
    const [allCourses, setAllCourses] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const navigate = useNavigate();
    const { showToast } = useToast();
    const { handleLogout } = useLogout();

    const { courses, fetchCourses, deleteCourse: storeDeleteCourse } = useCourseStore();

    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));

    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            const [customCourses, allReviews] = await Promise.all([
                getAllCourses(),
                getAllReviews().catch(() => [])
            ]);
            
            const currentUserId = String(user?.id || user?._id || "");

            // Map all DB courses with normalized fields
            const dbCourses = customCourses.map(c => ({
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
                totalLessons: c.totalLessons || c.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0,
                duration: c.duration || '0m',
                language: c.language || 'English',
                updatedAt: c.updatedAt || c.lastUpdated || new Date().toISOString(),
                modules: c.modules || []
            }));

            setAllCourses(dbCourses);

            // Filter reviews for lecturer's own created courses
            const myCourseIds = new Set(
                dbCourses
                    .filter(c => String(c.instructorId) === currentUserId)
                    .flatMap(c => [String(c._id), String(c.id)].filter(Boolean))
            );

            const filteredReviews = allReviews.filter(r => myCourseIds.has(String(r.courseId)));
            setReviews(filteredReviews);
        } catch (error) {
            console.error("Fetch error:", error);
            showToast("error", "Failed to fetch dashboard data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const handleRefresh = async () => {
        showToast("info", "Refreshing dashboard data...");
        await fetchAllData();
        showToast("success", "Dashboard updated");
    };

    const currentUserId = String(user?.id || user?._id || "");

    // Courses the lecturer themselves created
    const myCourses = allCourses
        .filter(c => String(c.instructorId || "") === currentUserId)
        .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));

    // Courses assigned/created by admin (anyone else)
    const adminCourses = allCourses
        .filter(c => String(c.instructorId || "") !== currentUserId)
        .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));



    const calcAvgRating = () => {
        if (!myCourses || myCourses.length === 0 || !reviews || reviews.length === 0) return "0.0";

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




    const handleEditCourse = (courseId) => {
        navigate(`/edit-course/${courseId}`);
    };

    const handleDeleteCourse = async (courseId, courseTitle) => {
        if (window.confirm(`Are you sure you want to delete "${courseTitle}"?`)) {
            try {
                // Only call API if it's a real course (string ID, not mock number ID)
                if (isNaN(Number(courseId))) {
                    await storeDeleteCourse(courseId);
                }
                
                setAllCourses(prev => prev.filter(c => (c._id || c.id) !== courseId));
                showToast("success", `Course "${courseTitle}" deleted successfully`);
            } catch (err) {
                console.error("Delete error:", err);
                showToast("error", err.message || "Failed to delete course");
            }
        }
    };


    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { id: "my-courses", label: "My Courses", icon: <BookOpen size={20} /> },
        { id: "create-course", label: "Create Course", icon: <PlusCircle size={20} /> },
        { id: "qr-session", label: "QR Session", icon: <QrCode size={20} /> },
        { id: "attendance", label: "Attendance Marking", icon: <Activity size={20} /> },
        { id: "reviews", label: "Reviews", icon: <Star size={20} /> },
        { id: "materials", label: "Materials", icon: <FileText size={20} /> },
        { id: "settings", label: "Settings", icon: <Settings size={20} /> },
    ];

    const renderContent = () => {
        if (isLoading) return <div className="loading-state">Loading your dashboard...</div>;

        if (activeTab === "create-course") {
            return (
                <CourseCreationForm
                    onSuccess={() => {
                        fetchAllData();
                        setActiveTab("dashboard");
                    }}
                />
            );
        }

        if (activeTab === "qr-session") {
            return <LecturerQRManager />;
        }

        if (activeTab === "attendance") {
            // Pass all courses where this lecturer is involved
            const availableCourses = allCourses.length > 0 ? allCourses : [];
            return <AttendanceView courses={availableCourses} />;
        }

        if (activeTab === "dashboard") {
            // Dashboard shows only courses assigned/created by admin
            const filteredCourses = adminCourses.filter(course =>
                (course.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
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
                                    {adminCourses.length}
                                </div>
                                <div className="stat-label">Assigned Courses</div>
                            </div>
                        </div>

                        <div className="premium-stat-card orange">
                            <div className="stat-icon-wrapper">
                                <Clock className="stat-icon" />
                            </div>
                            <div className="stat-data">
                                <div className="stat-value" title={adminCourses.length > 0 ? adminCourses[0].title : "No Course"}>
                                    {adminCourses.length > 0 ? adminCourses[0].title : "No Course"}
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
                                    <th>Last Updated</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCourses.length > 0 ? (
                                    filteredCourses.map(course => (
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
                                                    <span className="level-text">{course.level || "Beginner"}</span>
                                                </td>
                                                <td>
                                                    <span className="price-text">Rs. {course.price?.toLocaleString() || "0"}</span>
                                                </td>
                                                <td>
                                                    <span className="module-count">
                                                        {course.totalLessons || 0}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="date-text">
                                                        {course.updatedAt ? new Date(course.updatedAt).toLocaleDateString() : 'N/A'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="table-actions">
                                                        <button
                                                            type="button"
                                                            className="action-btn view"
                                                            title="View & Manage Content"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(`/lecturer/courses/${course._id || course.id}`);
                                                            }}
                                                        >
                                                            <Eye size={26} strokeWidth={2.5} color="#059669" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="action-btn edit"
                                                            title="Edit"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEditCourse(course._id || course.id);
                                                            }}
                                                        >
                                                            <Pencil size={26} strokeWidth={2.5} color="#2563eb" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="action-btn delete"
                                                            title="Delete"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteCourse(course._id || course.id, course.title);
                                                            }}
                                                        >
                                                            <Trash2 size={26} strokeWidth={2.5} color="#dc2626" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                    ))
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
            const handleReply = async (id, replyText) => {
                if (!replyText.trim()) return;
                try {
                    await addAdminReply(id, replyText);
                    showToast("success", "Reply added successfully");
                    fetchAllData();
                } catch (error) {
                    showToast("error", "Failed to add reply");
                }
            };

            const handleDeleteReview = async (id) => {
                if (!id) return;
                if (window.confirm("Are you sure you want to delete this review?")) {
                    try {
                        await deleteReviewApi(id);
                        showToast("success", "Review deleted successfully");
                        fetchAllData();
                    } catch (error) {
                        console.error("Delete review error:", error);
                        showToast("error", "Failed to delete review. Please try again.");
                    }
                }
            };

            return (
                <div className="reviews-grid-container animate-in fade-in duration-500">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
                            <Star className="text-amber-500 fill-amber-500" size={24} />
                            Student Reviews
                        </h2>
                        <div className="flex items-center gap-3">
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 px-4 py-1.5 text-sm font-bold">
                                {reviews.length} Feedbacks
                            </Badge>
                        </div>
                    </div>

                    {reviews.length === 0 ? (
                        <div className="empty-reviews-card">
                            <Star size={48} className="text-slate-200 mb-4" />
                            <h3>No reviews yet</h3>
                            <p>Student feedback for your courses will appear here.</p>
                        </div>
                    ) : (
                        <div className="reviews-card-grid">
                                {reviews.map((review) => {
                                    const matchedCourse = allCourses.find(c => String(c._id) === String(review.courseId) || String(c.id) === String(review.courseId));
                                    const courseTitle = matchedCourse ? matchedCourse.title : (review.courseName || "General Course");
                                    const studentName = review.studentId?.name || review.studentName || "Student";

                                    return (
                                        <div key={review._id} className="minimal-review-card">
                                            <div className="card-header-v4">
                                                <div className="user-profile-v4">
                                                    <div className="user-initial">{studentName.charAt(0)}</div>
                                                    <div className="user-info-v4">
                                                        <span className="user-name-v4">{studentName}</span>
                                                        <span className="course-name-v4">{courseTitle}</span>
                                                    </div>
                                                </div>
                                                <div className="rating-stars-v4">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star 
                                                            key={i} 
                                                            size={12} 
                                                            className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} 
                                                            strokeWidth={2.5}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="card-body-v4">
                                                <p>"{review.comment}"</p>
                                                
                                                {review.adminReply && (
                                                    <div className="reply-bubble-v4">
                                                        <div className="reply-label-v4">LECTURER RESPONSE</div>
                                                        <p>{review.adminReply}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="card-footer-v4">
                                                <span className="date-v4">{new Date(review.createdAt).toLocaleDateString()}</span>
                                                <div className="actions-v4">
                                                    <button 
                                                        className="pill-btn reply-btn" 
                                                        onClick={() => {
                                                            const reply = window.prompt("Reply to student:", review.adminReply || "");
                                                            if (reply !== null) handleReply(review._id, reply);
                                                        }}
                                                    >
                                                        <MessageSquare size={18} strokeWidth={2} />
                                                        <span>Reply</span>
                                                    </button>
                                                    <button 
                                                        className="pill-btn delete-btn" 
                                                        onClick={() => handleDeleteReview(review._id)}
                                                        title="Delete Review"
                                                    >
                                                        <Trash2 size={18} strokeWidth={2} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>
            );
        }

        if (activeTab === "materials") {
            return (
                <div className="materials-section animate-in fade-in duration-500">
                    <MaterialUpload />
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
                                    key={course._id || course.id}
                                    className="overflow-hidden hover:shadow-xl transition-all duration-300 group bg-white border-slate-100 flex flex-col"
                                >
                                    <div className="aspect-video relative overflow-hidden" onClick={() => navigate(`/lecturer/courses/${course._id || course.id}`)}>
                                        <img
                                            src={course.image || course.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop"}
                                            alt={course.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
                                        <Badge className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-800 border-none shadow-sm font-bold text-[10px]">
                                            {course.category || "General"}
                                        </Badge>
                                    </div>

                                    <CardHeader className="pb-2" onClick={() => navigate(`/lecturer/courses/${course._id || course.id}`)}>
                                        <CardTitle className="text-lg leading-tight group-hover:text-emerald-600 transition-colors line-clamp-1">{course.title}</CardTitle>
                                        <CardDescription className="line-clamp-2 mt-1 text-xs">
                                            {course.shortDescription || course.description || "No description provided."}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="pt-0 flex-grow">
                                        <div className="flex justify-between items-center mt-2 pb-4 border-b border-slate-50">
                                            <span className="text-xl font-black text-emerald-600">
                                                Rs. {course.price?.toLocaleString() || "Free"}
                                            </span>
                                            <div className="flex flex-col items-end">
                                                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                                                    <Star size={12} className="fill-amber-500" />
                                                    {course.rating || "4.5"}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 mt-4">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <GraduationCap size={14} />
                                                <span className="text-[11px] font-bold uppercase tracking-wider">{course.level || 'Beginner'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <BookOpen size={14} />
                                                <span className="text-[11px] font-bold uppercase tracking-wider">{course.totalLessons || '0'} Lessons</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); navigate(`/lecturer/courses/${course._id || course.id}`); }}
                                                    className="size-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-500 transition-all flex items-center justify-center"
                                                    title="View Course"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); navigate(`/edit-course/${course._id || course.id}`); }}
                                                    className="size-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-500 transition-all flex items-center justify-center"
                                                    title="Edit Course"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                            </div>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course._id || course.id, course.title); }}
                                                className="size-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all flex items-center justify-center"
                                                title="Delete Course"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        const activeItem = navItems.find(item => item.id === activeTab);
        return (
            <div className="empty-state-container animate-in fade-in duration-500">
                <div className="empty-state text-center">
                    <div className="empty-icon mb-4">
                        {activeItem?.icon && React.cloneElement(activeItem.icon, { size: 40 })}
                    </div>
                    <h2 className="text-xl font-bold">{activeItem?.label}</h2>
                    <p className="text-gray-500 mt-2">Section under construction. Stay tuned!</p>
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