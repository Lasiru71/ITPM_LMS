import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, Trash2, Power, PowerOff, AlertTriangle } from "lucide-react";
import { getAllStudents, deleteStudent, toggleUserStatus } from "../../api/Lasiru/adminApi";
import { useToast } from "../../components/Lasiru/ToastProvider";

const StudentManagement = ({ onUpdate }) => {
    const [students, setStudents] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const { showToast } = useToast();

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const data = await getAllStudents();
            setStudents(data);
        } catch (error) {
            console.error("Error fetching students:", error);
            showToast("error", "Failed to load students");
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
            (std.nicNumber?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-content-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h3 style={{ margin: 0 }}>Student Roster</h3>
                <div className="admin-search-container">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or ID..."
                        className="admin-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                             <th>NIC Number</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((std) => (
                            <tr key={std._id}>
                                 <td>{std.nicNumber || "N/A"}</td>
                                <td>{std.name}</td>
                                <td>{std.email}</td>
                                <td>
                                    <span className={`admin-badge ${std.isActive ? "badge-active" : "badge-inactive"}`}>
                                        {std.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="admin-actions">
                                    <button
                                        className="admin-btn admin-btn-ghost"
                                        onClick={() => handleToggleStatus(std._id)}
                                        title={std.isActive ? "Deactivate" : "Activate"}
                                    >
                                        {std.isActive ? <PowerOff size={16} /> : <Power size={16} />}
                                        {std.isActive ? "Deactivate" : "Activate"}
                                    </button>
                                    <button
                                        className="admin-btn admin-btn-danger"
                                        onClick={() => handleDeleteClick(std._id)}
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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
