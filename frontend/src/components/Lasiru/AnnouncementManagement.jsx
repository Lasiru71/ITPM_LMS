import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
    Megaphone,
    Search,
    Trash2,
    Edit,
    Plus,
    X,
    AlertTriangle,
    Tag,
    Clock,
    MoreVertical
} from "lucide-react";
import {
    getAllAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
} from "../../api/Lasiru/adminApi";
import { useToast } from "../../components/Lasiru/ToastProvider";

const AnnouncementManagement = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        category: "General",
        priority: "Low",
        toWhom: "All",
        isActive: true
    });

    const { showToast } = useToast();

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const data = await getAllAnnouncements();
            setAnnouncements(data);
        } catch (error) {
            console.error("Error fetching announcements:", error);
            showToast("error", "Failed to load announcements");
        }
    };

    const handleOpenModal = (announcement = null) => {
        if (announcement) {
            setFormData({
                title: announcement.title,
                content: announcement.content,
                category: announcement.category,
                priority: announcement.priority,
                toWhom: announcement.toWhom || "All",
                isActive: announcement.isActive
            });
            setIsEditing(true);
            setCurrentId(announcement._id);
        } else {
            setFormData({
                title: "",
                content: "",
                category: "General",
                priority: "Low",
                toWhom: "All",
                isActive: true
            });
            setIsEditing(false);
            setCurrentId(null);
        }
        setShowModal(true);
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            showToast("error", "Announcement Title is required");
            return false;
        }
        if (!formData.content.trim()) {
            showToast("error", "Content body is required");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            if (isEditing) {
                await updateAnnouncement(currentId, formData);
                showToast("success", "Announcement updated successfully");
            } else {
                await createAnnouncement(formData);
                showToast("success", "Announcement published successfully");
            }
            setShowModal(false);
            fetchAnnouncements();
        } catch (error) {
            showToast("error", error.response?.data?.message || "Failed to save announcement");
        }
    };

    const handleDeleteClick = (id) => {
        setCurrentId(id);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteAnnouncement(currentId);
            showToast("success", "Announcement deleted successfully");
            setShowConfirm(false);
            fetchAnnouncements();
        } catch (error) {
            showToast("error", "Failed to delete announcement");
        }
    };

    const filteredAnnouncements = announcements.filter(ann => {
        const matchesSearch = ann.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ann.content.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "All" || ann.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "High": return "#ef4444";
            case "Medium": return "#f59e0b";
            default: return "#3b82f6";
        }
    };

    const getToWhomBadgeStyle = (toWhom) => {
        switch (toWhom) {
            case 'Students': return { background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' };
            case 'Lecturers': return { background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' };
            default: return { background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' };
        }
    };

    return (
        <div className="premium-management-card" style={{ animation: "fadeInUp 0.6s ease-out" }}>
            <div className="management-header">
                <div>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Announcements</h3>
                    <p style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "0.25rem" }}>Manage platform-wide news and student alerts.</p>
                </div>
                <button className="admin-btn admin-btn-primary" onClick={() => handleOpenModal()} style={{ padding: "0.85rem 1.5rem" }}>
                    <Plus size={18} /> <span>New Announcement</span>
                </button>
            </div>

            <div style={{ display: "flex", gap: "1.5rem", marginBottom: "2.5rem" }}>
                <div className="modern-search-wrapper" style={{ flex: 1 }}>
                    <Search size={18} color="#94a3b8" />
                    <input
                        type="text"
                        placeholder="Search announcements..."
                        className="modern-search-input"
                        style={{ width: "100%" }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select
                    className="admin-input"
                    style={{ width: "220px", borderRadius: "1rem", border: "1px solid #e2e8f0", background: "#f8fafc" }}
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="All">All Categories</option>
                    <option value="General">General</option>
                    <option value="Academic">Academic</option>
                    <option value="Exam">Exam</option>
                    <option value="Event">Event</option>
                </select>
            </div>

            <div className="announcements-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "2rem" }}>
                {filteredAnnouncements.map((ann, idx) => (
                    <div key={ann._id} className="premium-card" style={{
                        background: "#fff",
                        borderRadius: "1.5rem",
                        padding: "2rem",
                        border: "1px solid #f1f5f9",
                        position: "relative",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02), 0 10px 15px -3px rgba(0,0,0,0.03)",
                        animation: `fadeInUp 0.6s ease-out ${idx * 0.05}s both`
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                            <div style={{ display: "flex", gap: "0.75rem" }}>
                                <span className="status-badge" style={{ background: "#f1f5f9", color: "#64748b", fontSize: "0.75rem" }}>
                                    <Tag size={12} /> {ann.category}
                                </span>
                                <span className="status-badge" style={{ ...getToWhomBadgeStyle(ann.toWhom), fontSize: "0.75rem" }}>
                                    {ann.toWhom}
                                </span>
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button
                                    className="action-icon-btn btn-toggle"
                                    onClick={() => handleOpenModal(ann)}
                                    title="Edit"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    className="action-icon-btn btn-delete"
                                    onClick={() => handleDeleteClick(ann._id)}
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <h4 style={{ margin: "0 0 1rem", fontSize: "1.25rem", fontWeight: 800, color: "#1e293b", lineHeight: 1.4 }}>{ann.title}</h4>
                        <p style={{
                            margin: "0 0 2rem",
                            color: "#64748b",
                            fontSize: "0.95rem",
                            lineHeight: 1.7,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden"
                        }}>
                            {ann.content}
                        </p>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1.25rem", borderTop: "1px solid #f8fafc" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#94a3b8", fontSize: "0.8rem", fontWeight: 500 }}>
                                <Clock size={14} /> {new Date(ann.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            <span style={{
                                color: getPriorityColor(ann.priority),
                                fontWeight: 800,
                                fontSize: "0.7rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.4rem"
                            }}>
                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "currentColor" }}></div>
                                {ann.priority} Priority
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && createPortal(
                <div className="admin-modal-overlay">
                    <div className="admin-modal" style={{ maxWidth: "600px" }}>
                        <h2>{isEditing ? "Edit Announcement" : "Publish Announcement"}</h2>
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="admin-form-group">
                                <label>Title</label>
                                <input
                                    className="admin-input"
                                    placeholder="Enter announcement headline..."
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Content</label>
                                <textarea
                                    className="admin-input"
                                    placeholder="Write the detailed announcement content here..."
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                ></textarea>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                <div className="admin-form-group">
                                    <label>Category</label>
                                    <select
                                        className="admin-input"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="General">General</option>
                                        <option value="Academic">Academic</option>
                                        <option value="Exam">Exam</option>
                                        <option value="Event">Event</option>
                                    </select>
                                </div>
                                <div className="admin-form-group">
                                    <label>Priority</label>
                                    <select
                                        className="admin-input"
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                            </div>
                            <div className="admin-form-group">
                                <label>Target Audience (To Whom)</label>
                                <select
                                    className="admin-input"
                                    value={formData.toWhom}
                                    onChange={(e) => setFormData({ ...formData, toWhom: e.target.value })}
                                >
                                    <option value="All">All</option>
                                    <option value="Students">Students</option>
                                    <option value="Lecturers">Lecturers</option>
                                </select>
                            </div>
                            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                                <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1 }}>
                                    {isEditing ? "Update Announcement" : "Publish Now"}
                                </button>
                                <button
                                    type="button"
                                    className="admin-btn admin-btn-ghost"
                                    style={{ flex: 1 }}
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {
                showConfirm && createPortal(
                    <div className="admin-modal-overlay">
                        <div className="admin-confirm-modal">
                            <div className="confirm-icon-container">
                                <AlertTriangle size={32} />
                            </div>
                            <h3>Delete Announcement?</h3>
                            <p>This news post will be permanently removed. This action cannot be undone.</p>
                            <div className="confirm-actions">
                                <button
                                    className="admin-btn admin-btn-ghost"
                                    onClick={() => setShowConfirm(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="admin-btn admin-btn-danger"
                                    onClick={confirmDelete}
                                >
                                    Delete Now
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }
        </div >
    );
};

export default AnnouncementManagement;
