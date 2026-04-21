import React, { useState, useEffect } from "react";
import { Bell, Calendar, ChevronLeft, ChevronRight, Inbox, LayoutDashboard, Megaphone, Users, BookOpen, GraduationCap, Settings, LogOut, User } from "lucide-react";
import { getPaginatedNotifications } from "../../api/Lasiru/adminApi";
import { useLogout } from "../../hooks/Lasiru/useLogout";
import "../../Styles/Lasiru/NotificationCenter.css";

const NotificationsPage = () => {
    const { handleLogout } = useLogout();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        total: 0,
        pages: 0,
        currentPage: 1
    });

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = user.role || "Student";

    useEffect(() => {
        fetchNotifications(1);
    }, []);

    const fetchNotifications = async (page) => {
        try {
            setLoading(true);
            const data = await getPaginatedNotifications(role, page, 10);
            setNotifications(data.notifications);
            setPagination({
                total: data.total,
                pages: data.pages,
                currentPage: data.currentPage
            });
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            fetchNotifications(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case "High": return "nc-priority-high";
            case "Medium": return "nc-priority-medium";
            default: return "nc-priority-low";
        }
    };

    return (
        <div className="nc-page-wrapper">
            {/* Left Gradient Panel */}
            <aside className="nc-sidebar-panel">
                <div className="nc-sidebar-logo">
                    <BookOpen size={28} />
                    <span>EduVault</span>
                </div>
                
                <ul className="nc-sidebar-menu">
                    <li className="nc-menu-item">
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </li>
                    <li className="nc-menu-item active">
                        <Bell size={20} />
                        <span>Notifications</span>
                    </li>
                    <li className="nc-menu-item">
                        <Users size={20} />
                        <span>Community</span>
                    </li>
                    <li className="nc-menu-item">
                        <GraduationCap size={20} />
                        <span>Coursework</span>
                    </li>
                </ul>

                <div className="nc-sidebar-footer" style={{ marginTop: 'auto' }}>
                    <div className="nc-menu-item">
                        <Settings size={20} />
                        <span>Settings</span>
                    </div>
                    <div className="nc-menu-item" style={{ color: '#f43f5e' }} onClick={handleLogout}>
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="nc-main-content">
                <header className="nc-header">
                    <div className="nc-header-left">
                        <h1>Notification Center</h1>
                    </div>
                    <div className="nc-header-actions">
                        <button className="nc-bell-btn">
                            <Bell size={22} />
                            <span className="nc-bell-dot"></span>
                        </button>
                        <div className="nc-user-avatar">
                            {user.name ? user.name.charAt(0).toUpperCase() : <User size={20} />}
                        </div>
                    </div>
                </header>

                <div className="nc-container">
                    <div className="nc-section-header">
                        <h2>Important Updates</h2>
                        <p>Stay updated with the latest announcements for {role}s.</p>
                    </div>

                    {loading ? (
                        <div style={{ padding: "4rem", textAlign: "center" }}>
                            <div className="spinner-small" style={{ width: "40px", height: "40px", margin: "0 auto", border: "3px solid #e2e8f0", borderTopColor: "#4f46e5", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                            <p style={{ marginTop: "1rem", color: "#64748b" }}>Loading your updates...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="nc-empty-state">
                            <Inbox size={64} className="nc-empty-icon" />
                            <h3>No notifications yet</h3>
                            <p>You're all caught up! Check back later for new updates.</p>
                        </div>
                    ) : (
                        <div className="nc-card-grid">
                            {notifications.map((notif) => {
                                const date = new Date(notif.createdAt);
                                return (
                                    <div key={notif._id} className="nc-card">
                                        <div className="nc-date-badge">
                                            <span className="nc-month">{date.toLocaleString('default', { month: 'short' })}</span>
                                            <span className="nc-day">{date.getDate()}</span>
                                        </div>

                                        <div className="nc-card-body">
                                            <div className="nc-card-top">
                                                <div>
                                                    <h3 className="nc-title">{notif.title}</h3>
                                                    <div className="nc-meta">
                                                        <span className={`nc-priority-tag ${getPriorityClass(notif.priority)}`}>
                                                            {notif.priority}
                                                        </span>
                                                        <span className="nc-time">
                                                            <Calendar size={14} /> {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className="nc-target-label">
                                                    FOR: {notif.toWhom.toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="nc-content">
                                                {notif.description || notif.content}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Pagination */}
                            {pagination.pages > 1 && (
                                <div className="nc-pagination">
                                    <button 
                                        className="nc-page-btn"
                                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                                        disabled={pagination.currentPage === 1}
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    
                                    {[...Array(pagination.pages)].map((_, i) => (
                                        <button 
                                            key={i + 1}
                                            onClick={() => handlePageChange(i + 1)}
                                            className={`nc-page-btn ${pagination.currentPage === i + 1 ? "active" : ""}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    <button 
                                        className="nc-page-btn"
                                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                                        disabled={pagination.currentPage === pagination.pages}
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes spin { to { transform: rotate(360deg); } }
            `}} />
        </div>
    );
};

export default NotificationsPage;
