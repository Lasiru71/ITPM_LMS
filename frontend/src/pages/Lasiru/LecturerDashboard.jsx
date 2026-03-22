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
    Trash2
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
    const [reviews, setReviews] = useState([]);
    const [allCourses, setAllCourses] = useState([]);

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
                const combined = [...MOCK_COURSES, ...customCourses.map(c => ({
                    _id: c._id,
                    title: c.title,
                    instructor: c.instructorName || c.instructor || 'Lecturer',
                    instructorId: c.instructorId,
                    price: c.price,
                    image: c.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
                    thumbnail: c.thumbnail,
                    rating: 4.5,
                    reviews: 10,
                    category: c.category || 'General',
                    updatedAt: c.updatedAt
                }))];
                setAllCourses(combined);
            } catch (error) {
                console.error("Error fetching all courses:", error);
                setAllCourses(MOCK_COURSES);
            }
        };
        loadReviews();
        fetchAllCourses();
    }, []);

    const calcAvgRating = () => {
        if (reviews.length === 0) return "0.0";
        const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
        return (sum / reviews.length).toFixed(1);
    };

    const myCourses = courses.filter(c => c.instructorId === (user._id || user.id));

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
            // Sort courses by lastUpdated (newest first) or simply use reverse of array
            // Now showing all courses from the system as requested
            const displayCourses = allCourses;


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
                                <div className="text-3xl font-black">{calcAvgRating()}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* COURSES */}
                    <div className="recent-activity mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">All Available Courses</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                            {displayCourses.length > 0 ? (
                                displayCourses.map(course => (

                                    <Card key={course._id || course.id}>
                                        <div className="aspect-video relative">
                                            <img
                                                src={course.image || course.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop"}
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
                                                {course.shortDescription || `By ${course.instructor}`}
                                            </CardDescription>
                                        </CardHeader>

                                         <CardContent>
                                            <div className="flex justify-between items-center">
                                                <span className="text-green-600 font-bold">
                                                    ${course.price}
                                                </span>
                                                
                                                <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                                                    <Star size={14} className="fill-amber-500" />
                                                    {course.rating || "4.5"}
                                                </div>
                                            </div>

                                            {/* Show edit/delete if it's the lecturer's own course */}
                                            {(course.instructorId === (user._id || user.id)) && (
                                                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        className="flex-1 h-8 text-xs font-bold gap-1 rounded-lg"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditCourse(course._id);
                                                        }}
                                                    >
                                                        <Pencil size={12} /> Edit
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg border-red-50"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteCourse(course._id, course.title);
                                                        }}
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <div className="col-span-full text-center text-gray-400">
                                    No courses available.
                                </div>
                            )}
                        </div>

                        {/* Pagination removed from dashboard for recent view */}

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
                                <Card key={course._id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
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
                                            {course.shortDescription || "No description provided."}
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

                                        <div className="flex gap-2 mt-6">
                                            <Button 
                                                variant="outline" 
                                                className="flex-1 border-slate-200 hover:bg-slate-50 text-slate-600 gap-2 h-11 rounded-xl font-bold"
                                                onClick={() => handleEditCourse(course._id)}
                                            >
                                                <Pencil size={16} /> Edit
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                className="border-red-100 hover:bg-red-50 text-red-500 hover:text-red-600 h-11 w-11 p-0 rounded-xl"
                                                onClick={() => handleDeleteCourse(course._id, course.title)}
                                            >
                                                <Trash2 size={18} />
                                            </Button>
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
                />

                <div className="lecturer-content-area">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default LecturerDashboard;