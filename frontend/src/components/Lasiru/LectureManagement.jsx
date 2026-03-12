import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { UserPlus, Search, Trash2, Power, PowerOff, X } from "lucide-react";
import { getAllLecturers, createLecturer, deleteLecturer, toggleUserStatus } from "../../api/Lasiru/adminApi";

const LectureManagement = ({ onUpdate }) => {
    const [lecturers, setLecturers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        phone: "",
    });

    useEffect(() => {
        fetchLecturers();
    }, []);

    const fetchLecturers = async () => {
        try {
            const data = await getAllLecturers();
            setLecturers(data);
        } catch (error) {
            console.error("Error fetching lecturers:", error);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await toggleUserStatus(id);
            fetchLecturers();
        } catch (error) {
            alert("Failed to toggle status");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this lecturer?")) {
            try {
                await deleteLecturer(id);
                fetchLecturers();
                onUpdate();
            } catch (error) {
                alert("Failed to delete lecturer");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createLecturer(formData);
            setShowModal(false);
            setFormData({ name: "", email: "", password: "", address: "", phone: "" });
            fetchLecturers();
            onUpdate();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to create lecturer");
        }
    };

    const filteredLecturers = lecturers.filter(
        (lec) =>
            (lec.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (lec.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-content-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h3 style={{ margin: 0 }}>Lecturer Directory</h3>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <div className="admin-search-container">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="admin-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="admin-btn admin-btn-primary" onClick={() => setShowModal(true)}>
                        <UserPlus size={18} /> Add New Lecturer
                    </button>
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLecturers.map((lec) => (
                            <tr key={lec._id}>
                                <td>{lec.name}</td>
                                <td>{lec.email}</td>
                                <td>
                                    <span className={`admin-badge ${lec.isActive ? "badge-active" : "badge-inactive"}`}>
                                        {lec.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="admin-actions">
                                    <button
                                        className="admin-btn admin-btn-ghost"
                                        onClick={() => handleToggleStatus(lec._id)}
                                        title={lec.isActive ? "Deactivate" : "Activate"}
                                    >
                                        {lec.isActive ? <PowerOff size={16} /> : <Power size={16} />}
                                        {lec.isActive ? "Deactivate" : "Activate"}
                                    </button>
                                    <button
                                        className="admin-btn admin-btn-danger"
                                        onClick={() => handleDelete(lec._id)}
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

            {showModal && createPortal(
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h2>Add New Lecturer</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="admin-form-group">
                                <label>Full Name</label>
                                <input
                                    className="admin-input"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Email Address</label>
                                <input
                                    className="admin-input"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>Password</label>
                                <input
                                    className="admin-input"
                                    type="password"
                                    required
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
        </div>
    );
};

export default LectureManagement;
