import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, Trash2, Star, CheckCircle, XCircle, AlertTriangle, MessageSquare } from "lucide-react";
import { getAllReviews, deleteReview, updateReviewStatus } from "../../api/Lasiru/reviewApi";
import { useToast } from "../../components/Lasiru/ToastProvider";

const ReviewManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const { showToast } = useToast();

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const data = await getAllReviews();
            setReviews(data);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            showToast("error", "Failed to load reviews");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteReview(deleteId);
            showToast("success", "Review deleted successfully");
            setShowConfirm(false);
            setDeleteId(null);
            fetchReviews();
        } catch (error) {
            showToast("error", "Failed to delete review");
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await updateReviewStatus(id, status);
            showToast("success", `Review ${status.toLowerCase()} successfully`);
            fetchReviews();
        } catch (error) {
            showToast("error", "Failed to update review status");
        }
    };

    const renderStars = (rating) => {
        return (
            <div style={{ display: "flex", gap: "2px", color: "#f59e0b" }}>
                {[...Array(5)].map((_, i) => (
                    <Star 
                        key={i} 
                        size={14} 
                        fill={i < rating ? "#f59e0b" : "none"} 
                        strokeWidth={2}
                    />
                ))}
            </div>
        );
    };

    const filteredReviews = reviews.filter(
        (rev) =>
            (rev.courseId?.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (rev.studentId?.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (rev.comment?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-content-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                    <h3 style={{ margin: 0 }}>Reviews & Ratings</h3>
                    <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                        Manage student feedback and course ratings
                    </p>
                </div>
                <div className="admin-search-container" style={{ width: "350px" }}>
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by course, student or comment..."
                        className="admin-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div style={{ padding: "4rem", textAlign: "center", color: "#64748b" }}>
                    Loading reviews...
                </div>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Student</th>
                                <th>Rating</th>
                                <th style={{ width: "30%" }}>Comment</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReviews.length > 0 ? (
                                filteredReviews.map((rev) => (
                                    <tr key={rev._id}>
                                        <td style={{ fontWeight: 600 }}>{rev.courseId?.title || "Deleted Course"}</td>
                                        <td>
                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                <span>{rev.studentId?.name || "Unknown"}</span>
                                                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{rev.studentId?.email}</span>
                                            </div>
                                        </td>
                                        <td>{renderStars(rev.rating)}</td>
                                        <td>
                                            <p style={{ 
                                                fontSize: "0.85rem", 
                                                lineHeight: "1.4", 
                                                margin: 0,
                                                display: "-webkit-box",
                                                WebkitLineClamp: "2",
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden"
                                            }}>
                                                {rev.comment}
                                            </p>
                                        </td>
                                        <td>
                                            <span className={`admin-badge ${
                                                rev.status === "Approved" ? "badge-active" : 
                                                rev.status === "Rejected" ? "badge-inactive" : ""
                                            }`}>
                                                {rev.status}
                                            </span>
                                        </td>
                                        <td className="admin-actions">
                                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                                {rev.status !== "Approved" && (
                                                    <button
                                                        className="admin-btn admin-btn-ghost"
                                                        style={{ color: "#10b981", padding: "0.4rem" }}
                                                        onClick={() => handleUpdateStatus(rev._id, "Approved")}
                                                        title="Approve Review"
                                                    >
                                                        <CheckCircle size={16} />
                                                    </button>
                                                )}
                                                {rev.status !== "Rejected" && (
                                                    <button
                                                        className="admin-btn admin-btn-ghost"
                                                        style={{ color: "#f59e0b", padding: "0.4rem" }}
                                                        onClick={() => handleUpdateStatus(rev._id, "Rejected")}
                                                        title="Reject Review"
                                                    >
                                                        <XCircle size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    className="admin-btn admin-btn-ghost"
                                                    style={{ color: "#ef4444", padding: "0.4rem" }}
                                                    onClick={() => handleDeleteClick(rev._id)}
                                                    title="Delete Review"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center", padding: "4rem", color: "#64748b" }}>
                                        <div style={{ marginBottom: "1rem" }}><MessageSquare size={48} style={{ opacity: 0.2, margin: "0 auto" }} /></div>
                                        No reviews found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {showConfirm && createPortal(
                <div className="admin-modal-overlay">
                    <div className="admin-confirm-modal">
                        <div className="confirm-icon-container">
                            <AlertTriangle size={32} />
                        </div>
                        <h3>Delete Review?</h3>
                        <p>Are you sure you want to permanently delete this student review? This action cannot be undone.</p>
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
                                Delete Review
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default ReviewManagement;
