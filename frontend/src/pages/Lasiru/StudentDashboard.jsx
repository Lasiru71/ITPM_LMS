import React, { useState, useEffect } from "react";
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
    CreditCard,
    CheckCircle,
    Clock,
    XCircle
} from "lucide-react";
import { useToast } from "../../components/Lasiru/ToastProvider";
import DashboardHeader from "../../components/Lasiru/DashboardHeader";
import "../../Styles/Lasiru/StudentDashboard.css";

const StudentDashboard = () => {
    const [activeTab, setActiveTab] = useState("my-learning");
    const navigate = useNavigate();
    const { showToast } = useToast();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [payments, setPayments] = useState([]);
    const [paymentsLoading, setPaymentsLoading] = useState(false);
    const [trackId, setTrackId] = useState("");

    useEffect(() => {
        fetchStudentPayments();
    }, []);

    const fetchStudentPayments = async () => {
        try {
            setPaymentsLoading(true);
            const studentId = user.studentId || user.id || user._id;
            if (!studentId) return;
            const res = await api.get(`/payments/student/${studentId}`);
            setPayments(res.data);
        } catch (error) {
            console.error("Error fetching payments:", error);
        } finally {
            setPaymentsLoading(false);
        }
    };

    const handleTrackSearch = async (e) => {
        e.preventDefault();
        if (!trackId) {
            showToast("warning", "Please enter a Student ID");
            return;
        }
        try {
            setPaymentsLoading(true);
            const res = await api.get(`/payments/student/${trackId.trim()}`);
            setPayments(res.data);
            if (res.data.length === 0) {
                showToast("info", "No records found for this ID");
            } else {
                showToast("success", `Found ${res.data.length} records`);
            }
        } catch (error) {
            console.error("Track error:", error);
            const msg = error.response?.data?.message || "Connection failed";
            showToast("error", `Tracking Failed: ${msg}`);
        } finally {
            setPaymentsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        showToast("success", "Logged out successfully");
        navigate("/login");
    };

    const navItems = [
        { id: "my-learning", label: "My Learning", icon: <PlayCircle size={20} /> },
        { id: "my-payments", label: "My Payments", icon: <CreditCard size={20} /> },
        { id: "browse", label: "Browse Courses", icon: <Search size={20} /> },
        { id: "certificates", label: "Certificates", icon: <Award size={20} /> },
        { id: "settings", label: "Settings", icon: <Settings size={20} /> },
    ];

    const renderDashboardOverview = () => {
        return (
            <div className="overview-container">
                <div className="welcome-banner student-banner">
                    <div className="welcome-content">
                        <h2>Welcome Back, Learner!</h2>
                        <p>You're making great progress. You have 2 assignments due this week and are halfway through your React Native course. Keep it up!</p>
                        <button className="primary-btn pulse-btn" onClick={() => setActiveTab('browse')}>
                            <Search size={18} /> Explore New Courses
                        </button>
                    </div>
                    <div className="welcome-illustration">
                        <div className="abstract-shape shape-1"></div>
                        <div className="abstract-shape shape-2"></div>
                        <Award size={64} className="banner-icon" />
                    </div>
                </div>

                <div className="section-title-row">
                    <h3>Continue Learning</h3>
                    <span className="view-all">View All</span>
                </div>

                <div className="course-progress-grid">
                    <div className="progress-card">
                        <div className="course-image react-bg"></div>
                        <div className="progress-content">
                            <h4>Modern React with Hooks</h4>
                            <span className="instructor">By Ajith Bandara</span>
                            <div className="progress-bar-container">
                                <div className="progress-bar-fill" style={{ width: '65%' }}></div>
                            </div>
                            <div className="progress-stats">
                                <span>65% Completed</span>
                                <span>12/18 Lessons</span>
                            </div>
                            <button className="continue-btn">
                                <PlayCircle size={16} /> Continue
                            </button>
                        </div>
                    </div>

                    <div className="progress-card">
                        <div className="course-image node-bg"></div>
                        <div className="progress-content">
                            <h4>Node.js API Masterclass</h4>
                            <span className="instructor">By Kamal Perera</span>
                            <div className="progress-bar-container">
                                <div className="progress-bar-fill" style={{ width: '30%' }}></div>
                            </div>
                            <div className="progress-stats">
                                <span>30% Completed</span>
                                <span>4/12 Lessons</span>
                            </div>
                            <button className="continue-btn">
                                <PlayCircle size={16} /> Continue
                            </button>
                        </div>
                    </div>
                </div>

                <div className="metrics-grid">
                    <div className="metric-card">
                        <div className="metric-icon-wrap bg-blue-light">
                            <BookOpen size={24} />
                        </div>
                        <div className="metric-info">
                            <h3>Enrolled Courses</h3>
                            <div className="metric-value">4</div>
                        </div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-icon-wrap bg-yellow-light">
                            <Award size={24} />
                        </div>
                        <div className="metric-info">
                            <h3>Certificates Earned</h3>
                            <div className="metric-value">2</div>
                        </div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-icon-wrap bg-green-light">
                            <ChevronRight size={24} />
                        </div>
                        <div className="metric-info">
                            <h3>Assignments Pending</h3>
                            <div className="metric-value">1</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderPayments = () => {
        if (paymentsLoading) return <div className="loading-state">Loading your payments...</div>;

        return (
            <div className="payments-container">
                <div className="track-search-bar">
                    <form onSubmit={handleTrackSearch}>
                        <input 
                            type="text" 
                            placeholder="Enter Student ID to track (e.g. IT2024001)" 
                            value={trackId}
                            onChange={(e) => setTrackId(e.target.value)}
                        />
                        <button type="submit">Track Status</button>
                    </form>
                </div>
                {payments.length === 0 ? (
                    <div className="no-payments">
                        <CreditCard size={48} opacity={0.2} style={{ marginBottom: '1rem' }} />
                        <p>No payment records found. Enroll in a course to see your payment status.</p>
                    </div>
                ) : (
                    payments.map((p) => {
                        const isApproved = p.status === "APPROVED";
                        const isRejected = p.status === "REJECTED";
                        const isPending = p.status === "PENDING";

                        return (
                            <div key={p._id} className="payment-card">
                                <div className="payment-header">
                                    <div className="payment-course-info">
                                        <h4>{p.course?.title || "Unknown Course"}</h4>
                                        <div className="payment-meta">
                                            <span>Date: {new Date(p.createdAt).toLocaleDateString()}</span>
                                            <span style={{ margin: '0 0.5rem' }}>•</span>
                                            <span>Method: {p.method}</span>
                                        </div>
                                    </div>
                                    <div className="payment-amount">
                                        $ {p.amount?.toLocaleString()}
                                    </div>
                                </div>

                                <div className="tracking-line">
                                    {/* Progress Fill */}
                                    <div 
                                        className={`tracking-progress-fill ${isPending ? 'primary-fill' : isRejected ? 'rejected-fill' : ''}`} 
                                        style={{ width: isApproved || isRejected ? '100%' : '50%' }}
                                    ></div>

                                    {/* Step 1: Submitted */}
                                    <div className="tracking-step completed">
                                        <div className="step-dot"><CheckCircle size={16} /></div>
                                        <span className="step-label">Payment Submitted</span>
                                    </div>

                                    {/* Step 2: Under Review */}
                                    <div className={`tracking-step ${isPending ? 'active' : 'completed'}`}>
                                        <div className="step-dot">
                                            {isPending ? <Clock size={16} /> : <CheckCircle size={16} />}
                                        </div>
                                        <span className="step-label">Under Review</span>
                                    </div>

                                    {/* Step 3: Approved / Rejected */}
                                    <div className={`tracking-step ${isApproved ? 'completed' : isRejected ? 'rejected' : ''}`}>
                                        <div className="step-dot">
                                            {isApproved ? <CheckCircle size={16} /> : isRejected ? <XCircle size={16} /> : <div style={{width: 8, height: 8, borderRadius: '50%', background: '#cbd5e1'}} />}
                                        </div>
                                        <span className="step-label">{isRejected ? 'Rejected' : 'Approved'}</span>
                                    </div>
                                </div>

                                {isRejected && p.adminRemark && (
                                    <div className="rejection-note" style={{ marginTop: '1rem', padding: '0.75rem', background: '#fef2f2', borderRadius: '0.5rem', border: '1px solid #fee2e2', color: '#b91c1c', fontSize: '0.85rem' }}>
                                        <strong>Reason:</strong> {p.adminRemark}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        );
    };

    const renderContent = () => {
        if (activeTab === "my-learning") {
            return renderDashboardOverview();
        }

        if (activeTab === "my-payments") {
            return renderPayments();
        }

        return (
            <div className="dashboard-placeholder">
                <div className="placeholder-icon">
                    {navItems.find(item => item.id === activeTab)?.icon}
                </div>
                <h2>{navItems.find(item => item.id === activeTab)?.label}</h2>
                <p>This premium section is currently under construction. Check back soon for exciting updates!</p>
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
