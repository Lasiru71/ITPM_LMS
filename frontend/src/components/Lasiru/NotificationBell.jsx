import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Clock, ChevronRight, Inbox } from "lucide-react";
import { getLatestNotifications } from "../../api/Lasiru/adminApi";

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = user.role || "Student"; // Default to student if not set

    useEffect(() => {
        fetchNotifications();

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await getLatestNotifications(role);
            setNotifications(data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    const getRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return "Just now";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    const getTargetBadgeStyle = (toWhom) => {
        // Handle variations (e.g., "Student" vs "Students")
        const target = toWhom?.toLowerCase();
        
        switch (target) {
            case "students":
            case "student":
                return { background: "rgba(16, 185, 129, 0.15)", color: "#047857", fontWeight: 600, border: "none" };
            case "lecturers":
            case "lecturer":
                return { background: "rgba(59, 130, 246, 0.15)", color: "#1d4ed8", fontWeight: 600, border: "none" };
            case "all":
                return { background: "rgba(139, 92, 246, 0.15)", color: "#6d28d9", fontWeight: 600, border: "none" };
            default:
                return { background: "rgba(100, 116, 139, 0.15)", color: "#334155", fontWeight: 600, border: "none" };
        }
    };

    return (
        <div className="dash-notif-container" ref={dropdownRef}>
            <button
                className={`dash-header-icon-btn ${isOpen ? "active" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
                title="Notifications"
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bell size={26} strokeWidth={2.5} style={{ stroke: "#0f172a", fill: "none", zIndex: 100 }} />
                </div>
                {notifications.length > 0 && <span className="dash-notif-badge"></span>}
            </button>

            {isOpen && (
                <div className="dash-notif-dropdown">
                    <div className="notif-dropdown-header">
                        <h3>Notifications</h3>
                        <span className="notif-count">{notifications.length} Recent</span>
                    </div>

                    <div className="notif-list-container">
                        {loading ? (
                            <div className="notif-empty-state">
                                <div className="spinner-small"></div>
                                <p>Loading...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="notif-empty-state">
                                <Inbox size={32} />
                                <p>No new notifications</p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div
                                    key={notif._id}
                                    className="notif-item"
                                    onClick={() => {
                                        setIsOpen(false);
                                        navigate("/notifications");
                                    }}
                                >
                                    <div className="notif-item-icon" style={getTargetBadgeStyle(notif.toWhom)}>
                                        {notif.priority === "High" ? "!" : <Bell size={20} strokeWidth={2.5} color="currentColor" />}
                                    </div>
                                    <div className="notif-item-content">
                                        <div className="notif-item-top">
                                            <h4>{notif.title}</h4>
                                            <span className="notif-time">{getRelativeTime(notif.createdAt)}</span>
                                        </div>
                                        <p className="notif-preview">{notif.description || notif.content}</p>
                                        <div className="notif-item-footer">
                                            <span className="notif-tag" style={getTargetBadgeStyle(notif.toWhom)}>
                                                {notif.toWhom}
                                            </span>
                                            {notif.priority === "High" && (
                                                <span className="notif-priority-tag">High Priority</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <button
                        className="notif-view-all-btn"
                        onClick={() => {
                            setIsOpen(false);
                            navigate("/notifications");
                        }}
                    >
                        View All Notifications <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
