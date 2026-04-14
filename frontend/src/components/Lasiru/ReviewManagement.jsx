import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, Trash2, Star, CheckCircle, XCircle, AlertTriangle, MessageSquare, Reply } from "lucide-react";
import { getAllReviews, deleteReview, updateReviewStatus, addAdminReply } from "../../api/Lasiru/reviewApi";
import { useToast } from "../../components/Lasiru/ToastProvider";

const ReviewManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [activeReview, setActiveReview] = useState(null);
    const [replyText, setReplyText] = useState("");
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

    const handleReplyClick = (review) => {
        setActiveReview(review);
        setReplyText(review.adminReply || "");
        setShowReplyModal(true);
    };

    const submitReply = async () => {
        if (!replyText.trim()) {
            showToast("error", "Please enter a reply");
            return;
        }
        try {
            await addAdminReply(activeReview._id, replyText);
            showToast("success", "Reply sent successfully");
            setShowReplyModal(false);
            fetchReviews();
        } catch (error) {
            showToast("error", "Failed to send reply");
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
            (rev.studentId?.nicNumber?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (rev.comment?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );

    return (
        <div className="premium-management-card" style={{ animation: "fadeInUp 0.6s ease-out" }}>
            <div className="management-header">
                <div>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e293b", margin: 0 }}>Reviews & Ratings</h3>
                    <p style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "0.25rem" }}>Monitor student feedback and manage course perceptions.</p>
                </div>
                <div className="modern-search-wrapper" style={{ width: "380px" }}>
                    <Search size={18} color="#94a3b8" />
                    <input
                        type="text"
                        placeholder="Search by course, student or ID..."
                        className="modern-search-input"
                        style={{ width: "100%" }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div style={{ padding: "6rem", textAlign: "center", color: "#94a3b8" }}>
                    <div className="loading-spinner" style={{ marginBottom: "1rem" }}></div>
                    <p style={{ fontWeight: 500 }}>Syncing reviews...</p>
                </div>
            ) : (
                <div className="admin-table-container">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Student & ID</th>
                                <th>Course</th>
                                <th>Rating</th>
                                <th style={{ width: "25%" }}>Comment</th>
                                <th>Status</th>
                                <th style={{ textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReviews.length > 0 ? (
                                filteredReviews.map((rev) => (
                                    <tr key={rev._id}>
                                        <td>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                                                <span style={{ fontWeight: 700, color: "#1e293b" }}>{rev.studentId?.name || "Unknown"}</span>
                                                <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontFamily: "monospace" }}>ID: {rev.studentId?.nicNumber || "N/A"}</span>
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: 500, color: "#475569" }}>{rev.courseName || "N/A"}</td>
                                        <td>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                                {renderStars(rev.rating)}
                                                <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: 600 }}>{new Date(rev.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <p style={{
                                                fontSize: "0.9rem",
                                                lineHeight: "1.5",
                                                color: "#64748b",
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
                                            {!rev.adminReply ? (
                                                <span className="status-badge" style={{ background: "#fef2f2", color: "#dc2626" }}>
                                                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }}></div>
                                                    Pending
                                                </span>
                                            ) : (
                                                <span className="status-badge status-active">
                                                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }}></div>
                                                    Replied
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                                                <button
                                                    className="action-icon-btn btn-toggle"
                                                    onClick={() => handleReplyClick(rev)}
                                                    title="Reply to Review"
                                                >
                                                    <Reply size={18} />
                                                </button>
                                                <button
                                                    className="action-icon-btn btn-delete"
                                                    onClick={() => handleDeleteClick(rev._id)}
                                                    title="Delete Review"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center", padding: "6rem", color: "#94a3b8" }}>
                                        <div style={{ marginBottom: "1.5rem" }}><MessageSquare size={56} style={{ opacity: 0.1, margin: "0 auto" }} /></div>
                                        <p style={{ fontSize: "1.1rem", fontWeight: 500 }}>No feedback discovered yet.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {showReplyModal && createPortal(
                <div className="admin-modal-overlay">
                    <div className="admin-confirm-modal" style={{ maxWidth: "500px", textAlign: "left" }}>
                        <h3 style={{ marginBottom: "0.5rem" }}>Reply to Review</h3>
                        <p style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "1.5rem" }}>
                            Your reply will be visible to the student on their reviews page.
                        </p>

                        <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "0.75rem", marginBottom: "1.5rem", borderLeft: "4px solid #10b981" }}>
                            <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600 }}>{activeReview.studentId?.name}:</p>
                            <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#475569" }}>"{activeReview.comment}"</p>
                        </div>

                        <textarea
                            className="admin-input"
                            style={{ width: "100%", minHeight: "120px", marginBottom: "1.5rem", padding: "1rem" }}
                            placeholder="Type your response here..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                        />

                        <div className="confirm-actions" style={{ justifyContent: "flex-end" }}>
                            <button
                                className="admin-btn admin-btn-ghost"
                                onClick={() => setShowReplyModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="admin-btn"
                                onClick={submitReply}
                                style={{ background: "#10b981", color: "white" }}
                            >
                                Send Reply
                            </button>
                        </div>
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
