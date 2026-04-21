import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, Trash2, Power, PowerOff, AlertTriangle, Edit3 } from "lucide-react";
import { getAllStudents, deleteStudent, toggleUserStatus, updateUserByAdmin } from "../../api/Lasiru/adminApi";
import { useToast } from "../../components/Lasiru/ToastProvider";

const StudentManagement = ({ onUpdate }) => {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({ name: "", email: "", studentId: "" });
    const [deleteId, setDeleteId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const { showToast } = useToast();

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setIsLoading(true);
            const data = await getAllStudents();
            setStudents(data);
        } catch (error) {
            console.error("Error fetching students:", error);
            showToast("error", "Failed to load students");
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await toggleUserStatus(id);
            showToast("success", "Status updated successfully");
            fetchStudents();
        } catch (error) {
            showToast("error", "Failed to toggle status");
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const handleEditClick = (std) => {
        setEditId(std._id);
        setEditData({ 
            name: std.name || "", 
            email: std.email || "", 
            studentId: std.studentId || "" 
        });
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editData.name.trim() || !editData.email.trim()) {
            showToast("error", "Name and Email are required");
            return;
        }
        
        try {
            await updateUserByAdmin(editId, editData);
            showToast("success", "Student details updated successfully");
            setShowEditModal(false);
            setEditId(null);
            fetchStudents();
            onUpdate();
        } catch (error) {
            showToast("error", error.response?.data?.message || "Failed to update student details");
        }
    };

    const confirmDelete = async () => {
        try {
            await deleteStudent(deleteId);
            showToast("success", "Student deleted successfully");
            setShowConfirm(false);
            setDeleteId(null);
            fetchStudents();
            onUpdate();
        } catch (error) {
            showToast("error", "Failed to delete student");
        }
    };

    const filteredStudents = students.filter(
        (std) =>
            (std.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (std.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (std.studentId?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );

    return (
        <div className="premium-management-card" style={{ animation: "fadeInUp 0.6s ease-out" }}>
            <div className="management-header">
                <div>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Student Roster</h3>
                    <p style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "0.25rem" }}>Monitor and manage student enrollment and accounts.</p>
                </div>
                <div className="modern-search-wrapper">
                    <Search size={18} color="#94a3b8" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or ID..."
                        className="modern-search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="admin-table-container">
                {isLoading ? (
                    <div style={{ padding: "4rem 2rem", textAlign: "center", color: "#64748b" }}>
                        <div style={{ width: '40px', height: '40px', border: '3px solid #f8fafc', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
                        <p style={{ margin: 0, fontWeight: 500 }}>Syncing student database...</p>
                    </div>
                ) : students.length === 0 ? (
                    <div style={{ padding: "4rem 2rem", textAlign: "center", color: "#64748b" }}>
                        <p style={{ margin: 0 }}>No students found in the system.</p>
                    </div>
                ) : (
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Email Address</th>
                                <th>Status</th>
                                <th style={{ textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((std) => (
                                <tr key={std._id}>
                                    <td style={{ color: "#64748b", fontSize: "0.85rem", fontFamily: "monospace" }}>{std.studentId || "N/A"}</td>
                                    <td style={{ fontWeight: 600, color: "#1e293b" }}>{std.name}</td>
                                    <td style={{ color: "#64748b" }}>{std.email}</td>                                <td>
                                        <span className={`status-badge ${std.isActive ? "status-active" : "status-inactive"}`}>
                                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }}></div>
                                            {std.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                                            <button
                                                className="action-icon-btn btn-edit"
                                                style={{ color: "#3b82f6", background: "rgba(59, 130, 246, 0.1)" }}
                                                onClick={() => handleEditClick(std)}
                                                title="Edit Student details"
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                            <button
                                                className="action-icon-btn btn-toggle"
                                                onClick={() => handleToggleStatus(std._id)}
                                                title={std.isActive ? "Deactivate" : "Activate"}
                                            >
                                                {std.isActive ? <PowerOff size={18} /> : <Power size={18} />}
                                            </button>
                                            <button
                                                className="action-icon-btn btn-delete"
                                                onClick={() => handleDeleteClick(std._id)}
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
                )}
            </div>

            {showEditModal && createPortal(
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h2>Edit Student Details</h2>
                        <form onSubmit={handleEditSubmit} noValidate>
                            <div className="admin-form-group">
                                <label>Full Name</label>
                                <input
                                    className="admin-input"
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Email Address</label>
                                <input
                                    className="admin-input"
                                    type="email"
                                    value={editData.email}
                                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>NIC Number (Optional)</label>
                                <input
                                    className="admin-input"
                                    type="text"
                                    placeholder="Enter 12-digit NIC"
                                    maxLength="12"
                                    value={editData.studentId}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        setEditData((prev) => ({ ...prev, studentId: val }));
                                    }}
                                />
                            </div>
                            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                                <button type="submit" className="admin-btn admin-btn-primary" style={{ flex: 1 }}>
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    className="admin-btn admin-btn-ghost"
                                    style={{ flex: 1 }}
                                    onClick={() => setShowEditModal(false)}
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
                        <h3>Delete Student?</h3>
                        <p>This action cannot be undone. All data associated with this student will be permanently removed.</p>
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

export default StudentManagement;
