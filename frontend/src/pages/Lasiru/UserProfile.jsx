import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    User, Camera, Lock, LogOut, Save,
    BookOpen, Bell, Calendar, Activity,
    ChevronLeft, Edit3, Shield, CheckCircle2
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
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [formData, setFormData] = useState({ name: "", address: "", phone: "" });
    const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

    useEffect(() => { fetchProfile(); }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await getMyProfile();
            setProfile(data.user);
            setFormData({ name: data.user.name || "", address: data.user.address || "", phone: data.user.phone || "" });
        } catch {
            showToast("error", "Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validation
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            showToast("error", "Please upload a valid image (JPEG, PNG, or WebP)");
            return;
        }
        
        // Increased limit for premium experience, backed by backend fix
        if (file.size > 5 * 1024 * 1024) { 
            showToast("error", "Image size must be under 5MB"); 
            return; 
        }

        setUploading(true);
        const reader = new FileReader();
        
        reader.onload = async () => {
            try {
                const base64Image = reader.result;
                await updateMyProfile({ profileImage: base64Image });
                
                // Update Local State
                setProfile(prev => ({ ...prev, profileImage: base64Image }));
                
                // Update current cached user info
                const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
                localStorage.setItem("user", JSON.stringify({ ...currentUser, profileImage: base64Image }));
                
                showToast("success", "Stunning new profile photo saved!");
            } catch (err) {
                console.error("Upload error:", err);
                showToast("error", err.response?.data?.message || "Failed to upload. The image might be too complex.");
            } finally {
                setUploading(false);
            }
        };

        reader.onerror = () => {
            showToast("error", "Failed to process image file");
            setUploading(false);
        };

        reader.readAsDataURL(file);
    };

    const handleUpdateProfile = async () => {
        if (!formData.name.trim()) { showToast("error", "Name is required"); return; }
        try {
            await updateMyProfile(formData);
            setProfile(prev => ({ ...prev, ...formData }));
            
            const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
            localStorage.setItem("user", JSON.stringify({ ...currentUser, name: formData.name }));
            
            setEditMode(false);
            showToast("success", "Profile details refreshed!");
        } catch (err) {
            showToast("error", err.response?.data?.message || "Oops! Failed to update profile.");
        }
    };

    const handleChangePassword = async () => {
        if (!passwordData.oldPassword || !passwordData.newPassword) { showToast("error", "Passwords cannot be empty"); return; }
        if (passwordData.newPassword !== passwordData.confirmPassword) { showToast("error", "Passwords don't match, please re-type"); return; }
        if (passwordData.newPassword.length < 6) { showToast("error", "Security requires at least 6 characters"); return; }
        try {
            await changeMyPassword({ oldPassword: passwordData.oldPassword, newPassword: passwordData.newPassword });
            showToast("success", "Password successfully secured!");
            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            showToast("error", err.response?.data?.message || "Security update failed.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        showToast("success", "Signed out successfully");
        navigate("/login");
    };

    const getInitials = (name) => name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U";

    const navSections = [
        { id: "info", label: "Personal Info", icon: <User size={18} /> },
        { id: "security", label: "Security", icon: <Lock size={18} /> },
        { id: "courses", label: "My Courses", icon: <BookOpen size={18} />, comingSoon: true },
        { id: "attendance", label: "Attendance", icon: <Calendar size={18} />, comingSoon: true },
        { id: "notifications", label: "Notifications", icon: <Bell size={18} />, comingSoon: true },
        { id: "activity", label: "Activity Log", icon: <Activity size={18} />, comingSoon: true },
    ];

    if (loading) return (
        <div className="up-loading">
            <div className="up-spinner" />
        </div>
    );

    return (
        <div className="up-page">
            <DashboardHeader title="My Profile" variant="dark" />

            <div className="up-layout">
                {/* Sidebar */}
                <aside className="up-sidebar">
                    {/* Avatar Card */}
                    <div className="up-avatar-card">
                        <div className="up-avatar-wrap" onClick={() => fileInputRef.current?.click()}>
                            {profile?.profileImage ? (
                                <img src={profile.profileImage} alt="avatar" className="up-avatar-img" />
                            ) : (
                                <div className="up-avatar-initials">{getInitials(profile?.name)}</div>
                            )}
                            <div className="up-avatar-overlay">
                                {uploading ? <div className="up-spinner-sm" /> : <Camera size={22} />}
                            </div>
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
                        <h3 className="up-profile-name">{profile?.name}</h3>
                        <span className={`up-role-badge up-role-${profile?.role?.toLowerCase()}`}>{profile?.role}</span>
                        <p className="up-join-date">Joined {new Date(profile?.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
                        {profile?.isActive && (
                            <span className="up-status-badge"><CheckCircle2 size={14} /> Active Account</span>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="up-nav">
                        {navSections.map(s => (
                            <button
                                key={s.id}
                                className={`up-nav-btn ${activeSection === s.id ? "active" : ""} ${s.comingSoon ? "coming-soon" : ""}`}
                                onClick={() => !s.comingSoon && setActiveSection(s.id)}
                            >
                                {s.icon}
                                <span>{s.label}</span>
                                {s.comingSoon && <span className="up-cs-tag">Soon</span>}
                            </button>
                        ))}
                    </nav>

                    <button className="up-signout-btn" onClick={handleLogout}>
                        <LogOut size={18} /> Sign Out
                    </button>
                </aside>

                {/* Main Content */}
                <main className="up-main">
                    {activeSection === "info" && (
                        <div className="up-section-card">
                            <div className="up-section-header">
                                <div>
                                    <h2>Personal Information</h2>
                                    <p>View and update your profile details.</p>
                                </div>
                                <button className={`up-edit-btn ${editMode ? "active" : ""}`} onClick={() => editMode ? setEditMode(false) : setEditMode(true)}>
                                    <Edit3 size={16} /> {editMode ? "Cancel" : "Edit Profile"}
                                </button>
                            </div>

                            {/* Read Mode */}
                            {!editMode && (
                                <div className="up-info-grid">
                                    <div className="up-info-item">
                                        <label>Full Name</label>
                                        <p>{profile?.name || "—"}</p>
                                    </div>
                                    <div className="up-info-item">
                                        <label>Email Address</label>
                                        <p>{profile?.email || "—"}</p>
                                    </div>
                                    <div className="up-info-item">
                                        <label>Phone Number</label>
                                        <p>{profile?.phone || "Not set"}</p>
                                    </div>
                                    <div className="up-info-item">
                                        <label>Address</label>
                                        <p>{profile?.address || "Not set"}</p>
                                    </div>
                                    <div className="up-info-item">
                                        <label>Role</label>
                                        <p>{profile?.role}</p>
                                    </div>
                                    {profile?.nicNumber && (
                                        <div className="up-info-item">
                                            <label>NIC Number</label>
                                            <p>{profile.nicNumber}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Edit Mode */}
                            {editMode && (
                                <div className="up-edit-form">
                                    <div className="up-form-row">
                                        <div className="up-form-group">
                                            <label>Full Name</label>
                                            <input className="up-input" placeholder="Your full name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                        </div>
                                        <div className="up-form-group">
                                            <label>Email Address</label>
                                            <input className="up-input up-input-disabled" value={profile?.email} disabled />
                                        </div>
                                    </div>
                                    <div className="up-form-row">
                                        <div className="up-form-group">
                                            <label>Phone Number</label>
                                            <input className="up-input" placeholder="+94 77 000 0000" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                        </div>
                                        <div className="up-form-group">
                                            <label>Address</label>
                                            <input className="up-input" placeholder="Your address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                                        </div>
                                    </div>
                                    <button className="up-save-btn" onClick={handleUpdateProfile}>
                                        <Save size={18} /> Save Changes
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeSection === "security" && (
                        <div className="up-section-card">
                            <div className="up-section-header">
                                <div>
                                    <h2>Account Security</h2>
                                    <p>Change your password to keep your account secure.</p>
                                </div>
                                <Shield size={28} style={{ color: "#8b5cf6" }} />
                            </div>
                            <div className="up-edit-form">
                                <div className="up-form-group">
                                    <label>Current Password</label>
                                    <input className="up-input" type="password" placeholder="Enter current password" value={passwordData.oldPassword} onChange={e => setPasswordData({ ...passwordData, oldPassword: e.target.value })} />
                                </div>
                                <div className="up-form-row">
                                    <div className="up-form-group">
                                        <label>New Password</label>
                                        <input className="up-input" type="password" placeholder="Min. 6 characters" value={passwordData.newPassword} onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
                                    </div>
                                    <div className="up-form-group">
                                        <label>Confirm Password</label>
                                        <input className="up-input" type="password" placeholder="Repeat new password" value={passwordData.confirmPassword} onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} />
                                    </div>
                                </div>
                                <button className="up-save-btn" onClick={handleChangePassword}>
                                    <Lock size={18} /> Update Password
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default UserProfile;