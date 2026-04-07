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

    return (
        <div className="admin-content-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2.5rem" }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: "1.5rem" }}>Announcements</h3>
                    <p style={{ color: "#64748b", marginTop: "0.5rem" }}>Manage platform-wide news and alerts.</p>
                </div>
                <button className="admin-btn admin-btn-primary" onClick={() => handleOpenModal()}>
                    <Plus size={18} /> New Announcement
                </button>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
                <div className="admin-search-container" style={{ flex: 1 }}>
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search announcements..."
                        className="admin-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select 
                    className="admin-input" 
                    style={{ width: "200px" }}
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

            <div className="announcements-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1.5rem" }}>
                {filteredAnnouncements.map((ann) => (
                    <div key={ann._id} className="announcement-card" style={{ 
                        background: "#f8fafc", 
                        borderRadius: "1.25rem", 
                        padding: "1.5rem",
                        border: "1px solid #e2e8f0",
                        position: "relative",
                        transition: "transform 0.2s, box-shadow 0.2s"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                            <span style={{ 
                                background: "white", 
                                padding: "0.4rem 0.8rem", 
                                borderRadius: "0.75rem", 
                                fontSize: "0.75rem", 
                                fontWeight: 700,
                                color: "#64748b",
                                border: "1px solid #e2e8f0",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.4rem"
                            }}>
                                <Tag size={12} /> {ann.category}
                            </span>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button 
                                    style={{ border: "none", background: "none", color: "#64748b", cursor: "pointer" }}
                                    onClick={() => handleOpenModal(ann)}
                                >
                                    <Edit size={18} />
                                </button>
                                <button 
                                    style={{ border: "none", background: "none", color: "#ef4444", cursor: "pointer" }}
                                    onClick={() => handleDeleteClick(ann._id)}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <h4 style={{ margin: "0 0 0.75rem", fontSize: "1.1rem" }}>{ann.title}</h4>
                        <p style={{ 
                            margin: "0 0 1.5rem", 
                            color: "#475569", 
                            fontSize: "0.9rem", 
                            lineHeight: 1.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden"
                        }}>
                            {ann.content}
                        </p>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#94a3b8", fontSize: "0.8rem" }}>
                                <Clock size={14} /> {new Date(ann.createdAt).toLocaleDateString()}
                            </div>
                            <span style={{ 
                                color: getPriorityColor(ann.priority), 
                                fontWeight: 600, 
                                fontSize: "0.8rem" 
                            }}>
                                ● {ann.priority} Priority
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

            {showConfirm && createPortal(
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
            )}
        </div>
    );
};

export default AnnouncementManagement;
