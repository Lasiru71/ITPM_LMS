import React, { useState, useEffect } from "react";
import { Star, MessageSquare, Trash2, Reply, Send, CheckCircle2, Calendar, BookOpen } from "lucide-react";
import { getAllReviews, deleteReview, addAdminReply } from "../../api/Lasiru/reviewApi";
import { useToast } from "../../components/Lasiru/ToastProvider";
import "../../Styles/Lasiru/ReviewsView.css";

const ReviewsView = () => {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState("");
    const { showToast } = useToast();

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setIsLoading(true);
            const data = await getAllReviews();
            setReviews(data);
        } catch (error) {
            showToast("error", "Failed to load student reviews");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to remove this feedback?")) return;
        try {
            await deleteReview(id);
            showToast("success", "Review removed successfully");
            setReviews(prev => prev.filter(r => r._id !== id));
        } catch (error) {
            showToast("error", "Could not delete review");
        }
    };

    const handleReply = async (id) => {
        if (!replyText.trim()) return;
        try {
            await addAdminReply(id, replyText);
            showToast("success", "Response sent to student");
            setReplyingTo(null);
            setReplyText("");
            fetchReviews();
        } catch (error) {
            showToast("error", "Failed to send response");
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star 
                key={i} 
                size={14} 
                fill={i < rating ? "#f59e0b" : "transparent"} 
                color={i < rating ? "#f59e0b" : "#cbd5e1"} 
            />
        ));
    };

    if (isLoading) {
        return (
            <div className="reviews-loading-state">
                <div className="spinner"></div>
                <p>Curating student feedback...</p>
            </div>
        );
    }

    return (
        <div className="reviews-view-container animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="reviews-summary-header">
                <div className="summary-info">
                    <h2>Course Feedback</h2>
                    <p>Insights from your student community</p>
                </div>
                <div className="summary-stats">
                    <div className="stat-pill">
                        <MessageSquare size={16} color="#3b82f6" />
                        {reviews.length} Total Reviews
                    </div>
                    <div className="stat-pill highlight">
                        <Star size={16} fill="white" />
                        {reviews.length > 0 
                            ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
                            : "0.0"} Avg. Rating
                    </div>
                </div>
            </div>

            {reviews.length === 0 ? (
                <div className="empty-reviews-state">
                    <MessageSquare size={48} strokeWidth={1.5} />
                    <h3>No Reviews Yet</h3>
                    <p>When students complete your courses, their feedback will appear here.</p>
                </div>
            ) : (
                <div className="reviews-grid">
                    {reviews.map((review) => (
                        <div key={review._id} className="review-card">
                            <div className="review-card-header">
                                <div className="student-profile">
                                    <div className="student-avatar-mini">
                                        {review.studentId?.name?.substring(0, 2).toUpperCase() || "ST"}
                                    </div>
                                    <div className="student-meta">
                                        <span className="student-name">{review.studentId?.name || "Student"}</span>
                                        <span className="review-date">
                                            <Calendar size={12} style={{marginRight: '4px', verticalAlign: 'middle'}} />
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="rating-badges">
                                    {renderStars(review.rating)}
                                </div>
                            </div>

                            <div className="review-course-tag">
                                <BookOpen size={12} style={{marginRight: '6px', verticalAlign: 'middle'}} />
                                {review.courseName}
                            </div>

                            <p className="review-comment">"{review.comment}"</p>

                            {review.adminReply && (
                                <div className="admin-reply-box">
                                    <div className="reply-header">
                                        <CheckCircle2 size={12} color="#10b981" />
                                        <span>Your Response</span>
                                    </div>
                                    <p>{review.adminReply}</p>
                                </div>
                            )}

                            <div className="review-card-footer">
                                {!review.adminReply && replyingTo !== review._id && (
                                    <button 
                                        className="review-action-btn reply"
                                        onClick={() => setReplyingTo(review._id)}
                                    >
                                        <Reply size={14} />
                                        Respond
                                    </button>
                                )}
                                <button 
                                    className="review-action-btn delete"
                                    onClick={() => handleDelete(review._id)}
                                >
                                    <Trash2 size={14} />
                                    Remove
                                </button>
                            </div>

                            {replyingTo === review._id && (
                                <div className="reply-input-area">
                                    <textarea 
                                        placeholder="Write a thank you note or clarification..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                    />
                                    <div className="reply-actions">
                                        <button className="cancel-btn" onClick={() => setReplyingTo(null)}>Cancel</button>
                                        <button className="send-btn" onClick={() => handleReply(review._id)}>
                                            <Send size={14} />
                                            Send Response
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewsView;
