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
        description: "",
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
                description: announcement.description || announcement.content || "",
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
                description: "",
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
        if (!formData.description.trim()) {
            showToast("error", "Description body is required");
            return false;
        }
        if (!formData.toWhom) {
            showToast("error", "Please select a target audience");
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
        const descMatch = (ann.description || ann.content || "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSearch = ann.title.toLowerCase().includes(searchQuery.toLowerCase()) || descMatch;
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
            case "Student": return { background: "#ecfdf5", color: "#10b981", border: "1px solid #10b981" };
            case "Lecture": return { background: "#eff6ff", color: "#3b82f6", border: "1px solid #3b82f6" };
            default: return { background: "#fef2f2", color: "#ef4444", border: "1px solid #ef4444" };
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
                            {ann.description || ann.content}
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
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                            <h2 style={{ margin: 0 }}>{isEditing ? "Edit Announcement" : "New Announcement"}</h2>
                            <button onClick={() => setShowModal(false)} style={{ border: "none", background: "none", cursor: "pointer", color: "#64748b" }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} noValidate>
                            <div className="admin-form-group">
                                <label>Target Audience (toWhom) <span style={{ color: "#ef4444" }}>*</span></label>
                                <select
                                    className="admin-input"
                                    value={formData.toWhom}
                                    onChange={(e) => setFormData({ ...formData, toWhom: e.target.value })}
                                    style={{ border: "2px solid #e2e8f0" }}
                                >
                                    <option value="Student">Student</option>
                                    <option value="Lecture">Lecture</option>
                                    <option value="All">All</option>
                                </select>
                            </div>

                            <div className="admin-form-group">
                                <label>Headline <span style={{ color: "#ef4444" }}>*</span></label>
                                <input
                                    className="admin-input"
                                    placeholder="e.g. Mid-semester exam schedules updated"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="admin-form-group">
                                <label>Detailed Description <span style={{ color: "#ef4444" }}>*</span></label>
                                <textarea
                                    className="admin-input"
                                    placeholder="Write the full announcement details here..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    style={{ minHeight: "120px" }}
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
                                    <label>Priority Level</label>
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

                            <div style={{ display: "flex", gap: "1rem", marginTop: "2.5rem" }}>
                                <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1, padding: "1rem" }}>
                                    {isEditing ? "Save Changes" : "Publish Announcement"}
                                </button>
                                <button
                                    type="button"
                                    className="admin-btn admin-btn-ghost"
                                    style={{ flex: 0.5 }}
                                    onClick={() => setShowModal(false)}
                                >
                                    Dismiss
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {showConfirm && createPortal(
                <div className="admin-modal-overlay">
                    <div className="admin-confirm-modal">
                        <div className="confirm-icon-container">
                            <AlertTriangle size={32} />
                        </div>
                        <h3>Remove Announcement?</h3>
                        <p>Are you sure you want to delete this announcement? This action will remove it for all targeted users.</p>
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
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default AnnouncementManagement;
