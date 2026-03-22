import React, { useState, useEffect, useRef } from "react";
import { Camera, Lock, Save, Edit3, Shield, CheckCircle2 } from "lucide-react";
import { getMyProfile, updateMyProfile, changeMyPassword } from "../../api/Lasiru/adminApi";
import { useToast } from "./ToastProvider";

import "../../Styles/Lasiru/UserProfile.css";

const LecturerSettings = ({ onProfileUpdate }) => {
    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
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
        
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            showToast("error", "Please upload a valid image (JPEG, PNG, or WebP)");
            return;
        }
        
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
                
                setProfile(prev => ({ ...prev, profileImage: base64Image }));
                
                const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
                const updatedUser = { ...currentUser, profileImage: base64Image };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                
                if (onProfileUpdate) onProfileUpdate(updatedUser);
                
                showToast("success", "Profile photo updated successfully!");
            } catch (err) {
                console.error("Upload error:", err);
                showToast("error", err.response?.data?.message || "Failed to upload image.");
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
            const updatedUser = { ...currentUser, name: formData.name };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            
            if (onProfileUpdate) onProfileUpdate(updatedUser);
            
            setEditMode(false);
            showToast("success", "Profile details updated successfully!");
        } catch (err) {
            showToast("error", err.response?.data?.message || "Failed to update profile.");
        }
    };

    const handleChangePassword = async () => {
        if (!passwordData.oldPassword || !passwordData.newPassword) { showToast("error", "Passwords cannot be empty"); return; }
        if (passwordData.newPassword !== passwordData.confirmPassword) { showToast("error", "Passwords don't match"); return; }
        if (passwordData.newPassword.length < 6) { showToast("error", "Password requires at least 6 characters"); return; }
        try {
            await changeMyPassword({ oldPassword: passwordData.oldPassword, newPassword: passwordData.newPassword });
            showToast("success", "Password successfully changed!");
            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            showToast("error", err.response?.data?.message || "Failed to update password.");
        }
    };

    const getInitials = (name) => name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "L";

    if (loading) return (
        <div className="flex items-center justify-center p-12">
            <div className="up-spinner" />
        </div>
    );

    return (
        <div className="animate-in fade-in duration-500 max-w-4xl mx-auto space-y-6 pb-12 text-left">
            <div className="flex flex-col md:flex-row gap-6">
                
                {/* Profile Card Summary */}
                <div className="w-full md:w-1/3">
                    <div className="up-avatar-card" style={{padding: "2rem"}}>
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
                        {profile?.isActive && (
                            <span className="up-status-badge mt-4"><CheckCircle2 size={14} /> Active Account</span>
                        )}
                    </div>
                </div>

                <div className="w-full md:w-2/3 space-y-6">
                    {/* Main Content */}
                    <div className="up-section-card">
                        <div className="up-section-header">
                            <div>
                                <h2 className="text-xl font-bold">Personal Information</h2>
                                <p className="text-sm text-gray-500">View and update your profile details.</p>
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

                    <div className="up-section-card">
                        <div className="up-section-header">
                            <div>
                                <h2 className="text-xl font-bold">Account Security</h2>
                                <p className="text-sm text-gray-500">Change your password to keep your account secure.</p>
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
                </div>
            </div>
        </div>
    );
};

export default LecturerSettings;
