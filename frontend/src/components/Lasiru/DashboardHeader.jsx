import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Bell, Search, User, LogOut, LayoutDashboard, Settings, Globe } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import "../../Styles/Lasiru/DashboardHeader.css";
import NotificationBell from "./NotificationBell";

const DashboardHeader = ({ title, showSearch = false, onSearchChange, variant = "light", user: userProp }) => {
    const navigate = useNavigate();
    const { user: storeUser } = useAuthStore();
    const user = userProp || storeUser || JSON.parse(localStorage.getItem("user") || "{}");
    const [profileOpen, setProfileOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const getDashboardPath = () => {
        switch (user.role) {
            case 'Admin': return '/admin-dashboard';
            case 'Lecturer': return '/lecturer-dashboard';
            case 'Student': return '/student-dashboard';
            default: return '/';
        }
    };

    return (
        <header className={`dash-unified-header ${variant}`}>
            <div className="dash-header-left">
                {showSearch ? (
                    <div className="dash-search-box">
                        <Search size={18} className="dash-search-icon" />
                        <input
                            type="text"
                            placeholder="Search everything..."
                            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                        />
                    </div>
                ) : (
                    <div className="dash-title-area">
                        <h1>{title || "Dashboard"}</h1>
                    </div>
                )}
            </div>

            <div className="dash-header-right">
                <Link to="/" className="dash-back-site-btn" title="Go to main website">
                    <Globe size={18} />
                    <span>Back to Site</span>
                </Link>

                <NotificationBell />

                <div className="dash-profile-dropdown-container">
                    <button
                        className="dash-profile-trigger"
                        onClick={() => setProfileOpen(!profileOpen)}
                    >
                        <div className="dash-user-avatar">
                            {user.profileImage ? (
                                <img src={user.profileImage} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                            ) : (
                                user.name ? user.name.charAt(0).toUpperCase() : "U"
                            )}
                        </div>
                        <span className="dash-user-name">{user.name?.split(' ')[0] || "User"}</span>
                    </button>

                    {profileOpen && (
                        <div className="dash-profile-dropdown">
                            <div className="dash-dropdown-user-info">
                                <p className="dash-user-full-name">{user.name}</p>
                                <p className="dash-user-email">{user.email}</p>
                                <span className={`dash-role-badge role-${user.role?.toLowerCase()}`}>{user.role}</span>
                            </div>
                            <div className="dash-dropdown-divider"></div>
                            <Link to={getDashboardPath()} className="dash-dropdown-item" onClick={() => setProfileOpen(false)}>
                                <LayoutDashboard size={16} /> Dashboard
                            </Link>
                            <Link to="/profile" className="dash-dropdown-item" onClick={() => setProfileOpen(false)}>
                                <User size={16} /> My Profile
                            </Link>
                            <div className="dash-dropdown-divider"></div>
                            <button className="dash-dropdown-item dash-logout" onClick={handleLogout}>
                                <LogOut size={16} /> Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
