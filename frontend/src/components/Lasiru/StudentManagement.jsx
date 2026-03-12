import React, { useState, useEffect } from "react";
import { Search, Trash2, Power, PowerOff } from "lucide-react";
import { getAllStudents, deleteStudent, toggleUserStatus } from "../../api/Lasiru/adminApi";

const StudentManagement = ({ onUpdate }) => {
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const data = await getAllStudents();
            setStudents(data);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await toggleUserStatus(id);
            fetchStudents();
        } catch (error) {
            alert("Failed to toggle status");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            try {
                await deleteStudent(id);
                fetchStudents();
                onUpdate();
            } catch (error) {
                alert("Failed to delete student");
            }
        }
    };

    const filteredStudents = students.filter(
        (std) =>
            (std.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (std.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (std.studentId?.toLowerCase() || "").includes(searchQuery.toLowerCase())
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
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((std) => (
                            <tr key={std._id}>
                                <td>{std.studentId || "N/A"}</td>
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
                                        onClick={() => handleDelete(std._id)}
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
        </div>
    );
};

export default StudentManagement;
