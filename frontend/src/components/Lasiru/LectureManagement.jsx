import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { UserPlus, Search, Trash2, Power, PowerOff, X, AlertTriangle } from "lucide-react";
import { getAllLecturers, createLecturer, deleteLecturer, toggleUserStatus } from "../../api/Lasiru/adminApi";
import { useToast } from "../../components/Lasiru/ToastProvider";

const LectureManagement = ({ onUpdate }) => {
    const [lecturers, setLecturers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        phone: "",
    });
    const { showToast } = useToast();

    useEffect(() => {
        fetchLecturers();
    }, []);

    const fetchLecturers = async () => {
        try {
            const data = await getAllLecturers();
            setLecturers(data);
        } catch (error) {
            console.error("Error fetching lecturers:", error);
            showToast("error", "Failed to load lecturers");
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await toggleUserStatus(id);
            showToast("success", "Status updated successfully");
            fetchLecturers();
        } catch (error) {
            showToast("error", "Failed to toggle status");
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteLecturer(deleteId);
            showToast("success", "Lecturer deleted successfully");
            setShowConfirm(false);
            setDeleteId(null);
            fetchLecturers();
            onUpdate();
        } catch (error) {
            showToast("error", "Failed to delete lecturer");
        }
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            showToast("error", "Full Name is required");
            return false;
        }
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            showToast("error", "Valid Email Address is required");
            return false;
        }
        if (formData.password.length < 6) {
            showToast("error", "Password must be at least 6 characters long");
            return false;
        }
        if (!formData.address.trim()) {
            showToast("error", "Address is required");
            return false;
        }
        if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
            showToast("error", "Valid 10-digit Phone Number is required");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await createLecturer(formData);
            showToast("success", "Lecturer added successfully");
            setShowModal(false);
            setFormData({ name: "", email: "", password: "", address: "", phone: "" });
            fetchLecturers();
            onUpdate();
        } catch (error) {
            showToast("error", error.response?.data?.message || "Failed to create lecturer");
        }
    };

    const filteredLecturers = lecturers.filter(
        (lec) =>
            (lec.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (lec.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );

    return (
        <div className="premium-management-card" style={{ animation: "fadeInUp 0.6s ease-out" }}>
            <div className="management-header">
                <div>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Lecturer Directory</h3>
                    <p style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "0.25rem" }}>Manage and monitor all platform educators.</p>
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <div className="modern-search-wrapper">
                        <Search size={18} color="#94a3b8" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="modern-search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="admin-btn admin-btn-primary" onClick={() => setShowModal(true)} style={{ padding: "0.85rem 1.5rem" }}>
                        <UserPlus size={18} /> <span>Add New Lecturer</span>
                    </button>
                </div>
            </div>

            <div className="admin-table-container">
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email Address</th>
                            <th>Status</th>
                            <th style={{ textAlign: "right" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLecturers.map((lec) => (
                            <tr key={lec._id}>
                                <td style={{ fontWeight: 600, color: "#1e293b" }}>{lec.name}</td>
                                <td style={{ color: "#64748b" }}>{lec.email}</td>
                                <td>
                                    <span className={`status-badge ${lec.isActive ? "status-active" : "status-inactive"}`}>
                                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }}></div>
                                        {lec.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                                        <button
                                            className="action-icon-btn btn-toggle"
                                            onClick={() => handleToggleStatus(lec._id)}
                                            title={lec.isActive ? "Deactivate" : "Activate"}
                                        >
                                            {lec.isActive ? <PowerOff size={18} /> : <Power size={18} />}
                                        </button>
                                        <button
                                            className="action-icon-btn btn-delete"
                                            onClick={() => handleDeleteClick(lec._id)}
                                            title="Delete Account"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && createPortal(
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h2>Add New Lecturer</h2>
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="admin-form-group">
                                <label>Full Name</label>
                                <input
                                    className="admin-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Email Address</label>
                                <input
                                    className="admin-input"
                                    type="text"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Password</label>
                                <input
                                    className="admin-input"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Address</label>
                                <input
                                    className="admin-input"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Phone Number</label>
                                <input
                                    className="admin-input"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                                <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1 }}>
                                    Create Lecturer
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
                        <h3>Delete Lecturer?</h3>
                        <p>This action cannot be undone. All data associated with this lecturer will be permanently removed.</p>
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
                                style={{ background: "#ef4444", color: "white" }}
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

export default LectureManagement;
