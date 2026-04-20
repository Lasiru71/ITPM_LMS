import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, Trash2, Star, CheckCircle, XCircle, AlertTriangle, MessageSquare, Reply, BookOpen } from "lucide-react";
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
            (rev.studentId?.studentId?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
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
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "2rem" }}>
                    {filteredReviews.length > 0 ? (
                        filteredReviews.map((rev, idx) => (
                            <div key={rev._id} className="premium-card" style={{
                                background: "linear-gradient(145deg, #ffffff, #f8fafc)",
                                borderRadius: "1.5rem",
                                padding: "2rem",
                                border: "1px solid rgba(226, 232, 240, 0.8)",
                                borderTop: rev.adminReply ? "4px solid #10b981" : "4px solid #ef4444",
                                boxShadow: "0 10px 30px -5px rgba(15, 23, 42, 0.06)",
                                position: "relative",
                                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                                animation: `fadeInUp 0.5s ease-out ${idx * 0.05}s both`
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                        <div style={{
                                            width: 46, height: 46, borderRadius: "14px",
                                            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                                            color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                                            fontWeight: 800, fontSize: "1.2rem", boxShadow: "0 4px 10px rgba(59, 130, 246, 0.3)"
                                        }}>
                                            {rev.studentId?.name ? rev.studentId.name.charAt(0).toUpperCase() : "S"}
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0, color: "#1e293b", fontSize: "1.1rem", fontWeight: 800 }}>{rev.studentId?.name || "Unknown Student"}</h4>
                                            <span style={{ fontSize: "0.8rem", color: "#64748b", fontFamily: "monospace" }}>ID: {rev.studentId?.studentId || "N/A"}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: "0.4rem" }}>
                                        <button className="action-icon-btn btn-toggle" onClick={() => handleReplyClick(rev)} title="Reply" style={{ width: 32, height: 32 }}>
                                            <Reply size={15} />
                                        </button>
                                        <button className="action-icon-btn btn-delete" onClick={() => handleDeleteClick(rev._id)} title="Delete" style={{ width: 32, height: 32 }}>
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>

                                <div style={{ background: "rgba(241, 245, 249, 0.6)", padding: "0.75rem 1rem", borderRadius: "0.75rem", marginBottom: "1.25rem", display: "inline-block" }}>
                                    <span style={{ color: "#3b82f6", fontWeight: 700, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        <BookOpen size={14} /> {rev.courseName || "Unknown Course"}
                                    </span>
                                </div>

                                <div style={{ marginBottom: "1.25rem" }}>
                                    {renderStars(rev.rating)}
                                </div>

                                <p style={{
                                    color: "#475569", fontSize: "0.95rem", lineHeight: 1.7, margin: "0 0 1.5rem",
                                    display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden"
                                }}>
                                    "{rev.comment}"
                                </p>

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "1.25rem" }}>
                                    <span style={{ color: "#94a3b8", fontSize: "0.8rem", fontWeight: 600 }}>
                                        {new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    {!rev.adminReply ? (
                                        <span className="status-badge" style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "0.4rem 0.8rem", fontSize: "0.75rem" }}>
                                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }}></div>
                                            Pending Reply
                                        </span>
                                    ) : (
                                        <span className="status-badge" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981", padding: "0.4rem 0.8rem", fontSize: "0.75rem" }}>
                                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }}></div>
                                            Replied
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "6rem", background: "white", borderRadius: "1.5rem", border: "1px dashed #cbd5e1" }}>
                            <MessageSquare size={56} style={{ opacity: 0.1, margin: "0 auto 1.5rem", color: "#64748b" }} />
                            <h3 style={{ margin: "0 0 0.5rem", color: "#1e293b", fontSize: "1.2rem" }}>No Reviews Found</h3>
                            <p style={{ color: "#64748b" }}>Wait for students to drop some feedback.</p>
                        </div>
                    )}
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
