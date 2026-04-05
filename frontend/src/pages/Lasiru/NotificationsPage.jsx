import React, { useState, useEffect } from "react";
import { Bell, Calendar, ChevronLeft, ChevronRight, Inbox, AlertCircle } from "lucide-react";
import { getPaginatedNotifications } from "../../api/Lasiru/adminApi";
import DashboardHeader from "../../components/Lasiru/DashboardHeader";
import AuthLayout from "../../components/Lasiru/AuthLayout";

const NotificationsPage = () => {
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

    const getPriorityStyle = (priority) => {
        switch (priority) {
            case "High": return { color: "#ef4444", background: "#fef2f2" };
            case "Medium": return { color: "#f59e0b", background: "#fffbeb" };
            default: return { color: "#3b82f6", background: "#eff6ff" };
        }
    };

    return (
        <AuthLayout>
            <DashboardHeader title="All Notifications" />
            <main className="dash-main-content">
                <div className="admin-content-card">
                    <div style={{ marginBottom: "2rem" }}>
                        <h2 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 800 }}>Notification Center</h2>
                        <p style={{ color: "#64748b", marginTop: "0.5rem" }}>
                            Stay updated with the latest announcements for {role}s.
                        </p>
                    </div>

                    {loading ? (
                        <div style={{ padding: "4rem", textAlign: "center" }}>
                            <div className="spinner-small" style={{ width: "40px", height: "40px", margin: "0 auto" }}></div>
                            <p style={{ marginTop: "1rem", color: "#64748b" }}>Loading notifications...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div style={{ padding: "5rem 2rem", textAlign: "center", background: "#f8fafc", borderRadius: "1.5rem" }}>
                            <Inbox size={64} color="#e2e8f0" style={{ marginBottom: "1.5rem" }} />
                            <h3 style={{ margin: 0, color: "#1e293b" }}>No notifications found</h3>
                            <p style={{ color: "#64748b", marginTop: "0.5rem" }}>You're all caught up! Check back later for new updates.</p>
                        </div>
                    ) : (
                        <div className="notification-list-full">
                            {notifications.map((notif) => (
                                <div key={notif._id} className="notification-row" style={{ 
                                    padding: "2rem",
                                    borderBottom: "1px solid #f1f5f9",
                                    display: "flex",
                                    gap: "2rem",
                                    transition: "background 0.2s"
                                }}>
                                    <div className="notif-date-box" style={{ 
                                        width: "80px", 
                                        height: "80px", 
                                        background: "#f8fafc", 
                                        borderRadius: "1rem",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                        border: "1px solid #e2e8f0"
                                    }}>
                                        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>
                                            {new Date(notif.createdAt).toLocaleString('default', { month: 'short' })}
                                        </span>
                                        <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a" }}>
                                            {new Date(notif.createdAt).getDate()}
                                        </span>
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                                            <div>
                                                <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#1e293b" }}>{notif.title}</h3>
                                                <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem", alignItems: "center" }}>
                                                    <span style={{ 
                                                        fontSize: "0.75rem", 
                                                        fontWeight: 700, 
                                                        padding: "0.25rem 0.75rem", 
                                                        borderRadius: "999px",
                                                        ...getPriorityStyle(notif.priority)
                                                    }}>
                                                        {notif.priority} Priority
                                                    </span>
                                                    <span style={{ fontSize: "0.75rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                                        <Calendar size={14} /> {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                            <span style={{ 
                                                fontSize: "0.7rem", 
                                                fontWeight: 800, 
                                                color: "#64748b", 
                                                background: "#f1f5f9", 
                                                padding: "0.3rem 0.8rem", 
                                                borderRadius: "0.5rem" 
                                            }}>
                                                TARGET: {notif.toWhom.toUpperCase()}
                                            </span>
                                        </div>
                                        <p style={{ color: "#475569", lineHeight: 1.7, fontSize: "1rem", margin: 0 }}>
                                            {notif.description || notif.content}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* Pagination */}
                            {pagination.pages > 1 && (
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "3rem" }}>
                                    <button 
                                        className="admin-btn admin-btn-ghost"
                                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                                        disabled={pagination.currentPage === 1}
                                        style={{ padding: "0.75rem" }}
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    
                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                        {[...Array(pagination.pages)].map((_, i) => (
                                            <button 
                                                key={i + 1}
                                                onClick={() => handlePageChange(i + 1)}
                                                className={`admin-btn ${pagination.currentPage === i + 1 ? "admin-btn-primary" : "admin-btn-ghost"}`}
                                                style={{ minWidth: "40px", height: "40px", padding: 0 }}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button 
                                        className="admin-btn admin-btn-ghost"
                                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                                        disabled={pagination.currentPage === pagination.pages}
                                        style={{ padding: "0.75rem" }}
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
                .notification-row:last-child { border-bottom: none; }
                .notification-row:hover { background: #fcfdfe; }
                @media (max-width: 640px) {
                    .notification-row { flex-direction: column; gap: 1rem !important; }
                    .notif-date-box { width: 60px !important; height: 60px !important; }
                }
            `}} />
        </AuthLayout>
    );
};

export default NotificationsPage;
