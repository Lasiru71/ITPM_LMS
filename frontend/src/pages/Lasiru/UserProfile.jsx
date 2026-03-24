import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    User, Camera, Lock, LogOut, Save,
    BookOpen, Bell, Calendar, Activity,
    ChevronLeft, Edit3, Shield, CheckCircle2,
    AlertTriangle
} from "lucide-react";
import { getMyProfile, updateMyProfile, changeMyPassword } from "../../api/Lasiru/adminApi";
import { useToast } from "../../components/Lasiru/ToastProvider";
import DashboardHeader from "../../components/Lasiru/DashboardHeader";
import "../../Styles/Lasiru/UserProfile.css";

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [activeSection, setActiveSection] = useState("info");
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [formData, setFormData] = useState({ name: "", address: "", phone: "" });
    const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

    useEffect(() => { 
        fetchProfile(); 
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getMyProfile();
            if (data && data.user) {
                setProfile(data.user);
                setFormData({ 
                    name: data.user.name || "", 
                    address: data.user.address || "", 
                    phone: data.user.phone || "" 
                });
            } else {
                setError("Profile data is incomplete or unavailable.");
            }
        } catch (err) {
            console.error("Profile Fetch Error:", err);
            setError("Unable to connect to the server. Please check your connection.");
            showToast("error", "Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        if (!formData.name.trim()) { showToast("error", "Name is required"); return; }
        try {
            await updateMyProfile(formData);
            setProfile(prev => ({ ...prev, ...formData }));
            const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
            localStorage.setItem("user", JSON.stringify({ ...currentUser, name: formData.name }));
            setEditMode(false);
            showToast("success", "Profile updated successfully");
        } catch (err) {
            showToast("error", "Failed to update profile.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const getInitials = (name) => {
        if (!name || typeof name !== 'string') return "U";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    };

    if (loading) return (
        <div className="up-loading" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
            <div className="up-spinner" style={{ width: 40, height: 40, border: '4px solid #1e293b', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    if (error && !profile) return (
        <div className="up-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="up-section-card" style={{ textAlign: 'center', maxWidth: '400px' }}>
                <AlertTriangle size={64} color="#ef4444" style={{ marginBottom: '1.5rem' }} />
                <h2>Connection Error</h2>
                <p style={{ color: '#94a3b8', margin: '1rem 0 2rem' }}>{error}</p>
                <button className="up-save-btn" onClick={fetchProfile} style={{ margin: '0 auto' }}>
                    Retry Loading
                </button>
            </div>
        </div>
    );

    return (
        <div className="up-page">
            <DashboardHeader title="My Profile" variant="dark" />

            <div className="up-layout">
                <aside className="up-sidebar">
                    <div className="up-avatar-card">
                        <div className="up-avatar-wrap" onClick={() => fileInputRef.current?.click()}>
                            {profile?.profileImage ? (
                                <img src={profile.profileImage} alt="avatar" className="up-avatar-img" />
                            ) : (
                                <div className="up-avatar-initials">{getInitials(profile?.name)}</div>
                            )}
                        </div>
                        <h3 className="up-profile-name">{profile?.name || "User Profile"}</h3>
                        <span className={`up-role-badge up-role-${String(profile?.role || 'student').toLowerCase()}`}>
                            {profile?.role || "Student"}
                        </span>
                        <p className="up-join-date">
                            {profile?.createdAt ? (
                                `Joined ${new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}`
                            ) : (
                                "Account Active"
                            )}
                        </p>
                    </div>

                    <nav className="up-nav">
                        <button className={`up-nav-btn ${activeSection === "info" ? "active" : ""}`} onClick={() => setActiveSection("info")}>
                            <User size={18} /> <span>Personal Info</span>
                        </button>
                        <button className={`up-nav-btn ${activeSection === "security" ? "active" : ""}`} onClick={() => setActiveSection("security")}>
                            <Lock size={18} /> <span>Security</span>
                        </button>
                    </nav>

                    <button className="up-signout-btn" onClick={handleLogout}>
                        <LogOut size={18} /> Sign Out
                    </button>
                </aside>

                <main className="up-main">
                    {activeSection === "info" && (
                        <div className="up-section-card">
                            <div className="up-section-header">
                                <div>
                                    <h2>Personal Details</h2>
                                    <p>Manage your account information.</p>
                                </div>
                                <button className="up-edit-btn" onClick={() => setEditMode(!editMode)}>
                                    <Edit3 size={16} /> {editMode ? "Cancel" : "Edit"}
                                </button>
                            </div>

                            {!editMode ? (
                                <div className="up-info-grid">
                                    <div className="up-info-item">
                                        <label>Full Name</label>
                                        <p>{profile?.name || "—"}</p>
                                    </div>
                                    <div className="up-info-item">
                                        <label>Email</label>
                                        <p>{profile?.email || "—"}</p>
                                    </div>
                                    <div className="up-info-item">
                                        <label>Phone</label>
                                        <p>{profile?.phone || "Not provided"}</p>
                                    </div>
                                    <div className="up-info-item">
                                        <label>Role</label>
                                        <p>{profile?.role || "Student"}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="up-edit-form">
                                    <div className="up-form-group">
                                        <label>Full Name</label>
                                        <input className="up-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                    <div className="up-form-row">
                                        <div className="up-form-group">
                                            <label>Phone</label>
                                            <input className="up-input" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                        </div>
                                        <div className="up-form-group">
                                            <label>Address</label>
                                            <input className="up-input" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                                        </div>
                                    </div>
                                    <button className="up-save-btn" onClick={handleUpdateProfile}>
                                        <Save size={18} /> Update Profile
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeSection === "security" && (
                        <div className="up-section-card">
                            <div className="up-section-header">
                                <h2>Security Settings</h2>
                                <Shield size={24} color="#8b5cf6" />
                            </div>
                            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Change your password to keep your account safe.</p>
                            <div className="up-edit-form">
                                <div className="up-form-group">
                                    <label>Current Password</label>
                                    <input className="up-input" type="password" value={passwordData.oldPassword} onChange={e => setPasswordData({ ...passwordData, oldPassword: e.target.value })} />
                                </div>
                                <div className="up-form-group">
                                    <label>New Password</label>
                                    <input className="up-input" type="password" value={passwordData.newPassword} onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
                                </div>
                                <button className="up-save-btn" onClick={() => showToast("info", "Password change is coming soon")}>
                                    <Lock size={18} /> Change Password
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={() => showToast("info", "Image upload disabled for safety")} />
        </div>
    );
};

export default UserProfile;