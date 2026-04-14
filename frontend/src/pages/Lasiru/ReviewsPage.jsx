import React, { useState, useEffect } from 'react';
import { Star, Send, MessageSquare, Clock, CheckCircle, AlertCircle, Trash2, Loader2 } from 'lucide-react';
import { getStudentReviews, createReview, deleteReview } from '../../api/Lasiru/reviewApi';
import { useToast } from '../../components/Lasiru/ToastProvider';
import '../../Styles/Lasiru/StudentDashboard.css';

const PLATFORM_COURSES = [
    { _id: 'course-1', title: 'React Fundamentals' },
    { _id: 'course-2', title: 'Advanced JavaScript' },
    { _id: 'course-3', title: 'Node.js & Express' },
    { _id: 'course-4', title: 'MongoDB Database Design' },
    { _id: 'course-5', title: 'UI/UX Design Principles' },
    { _id: 'course-6', title: 'Python for Beginners' },
    { _id: 'course-7', title: 'Machine Learning Basics' },
    { _id: 'course-8', title: 'Data Structures & Algorithms' },
    { _id: 'course-9', title: 'DevOps & CI/CD' },
    { _id: 'course-10', title: 'Cybersecurity Essentials' },
];

// No hardcoded courses needed anymore

export default function ReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [formData, setFormData] = useState({
        courseId: '',
        courseName: '',
        rating: 5,
        comment: ''
    });
    const [isReviewsLoading, setIsReviewsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingIds, setDeletingIds] = useState(new Set());
    const [message, setMessage] = useState({ type: '', text: '' });
    const { showToast } = useToast();

    useEffect(() => {
        fetchReviews();
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await fetch('/api/courses', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            if (response.ok) {
                const data = await response.json();
                const backendCourses = Array.isArray(data) ? data : [];
                setAvailableCourses(backendCourses.length > 0 ? backendCourses : PLATFORM_COURSES);
            } else {
                setAvailableCourses(PLATFORM_COURSES);
            }
        } catch (error) {
            setAvailableCourses(PLATFORM_COURSES);
        }
    };

    const fetchReviews = async () => {
        try {
            setIsReviewsLoading(true);
            const data = await getStudentReviews();
            setReviews(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            setMessage({ type: 'error', text: 'Could not load your history. Please check if you are logged in.' });
        } finally {
            setIsReviewsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "courseId") {
            const selectedCourse = availableCourses.find(c => (c._id || c.id) === value);
            setFormData(prev => ({
                ...prev,
                courseId: value,
                courseName: selectedCourse ? selectedCourse.title : ''
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage({ type: 'error', text: 'You must be logged in to post a review.' });
            return;
        }

        if (!formData.courseName) {
            setMessage({ type: 'error', text: 'Please select a course.' });
            return;
        }

        try {
            setIsSubmitting(true);
            // Send only courseName, rating, comment - courseId is an ObjectId and our IDs are strings
            const payload = { courseName: formData.courseName, rating: formData.rating, comment: formData.comment };
            await createReview(payload);
            setMessage({ type: 'success', text: 'Review submitted successfully!' });
            showToast('success', 'Your review has been posted!');
            setFormData({ courseId: '', courseName: '', rating: 5, comment: '' });
            fetchReviews(); // Refresh history
        } catch (error) {
            const msg = error.response?.data?.message || 'Error submitting review.';
            setMessage({ type: 'error', text: msg });
            showToast('error', msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
            return;
        }

        try {
            setDeletingIds(prev => new Set(prev).add(reviewId));
            await deleteReview(reviewId);
            showToast("success", "Review deleted successfully.");
            fetchReviews(); // Refresh history
        } catch (error) {
            console.error("Error deleting review:", error);
            showToast("error", "Failed to delete review. Please try again.");
        } finally {
            setDeletingIds(prev => {
                const next = new Set(prev);
                next.delete(reviewId);
                return next;
            });
        }
    };

    return (
        <div className="dashboard-container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a' }}>Reviews & <span style={{ color: '#10b981' }}>Ratings</span></h1>
                <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Share your learning experience and view administrative feedback.</p>
            </header>

            {message.text && (
                <div style={{
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    marginBottom: '2rem',
                    background: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
                    color: message.type === 'success' ? '#065f46' : '#991b1b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    border: `1px solid ${message.type === 'success' ? '#10b981' : '#ef4444'}`
                }}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2.5rem' }}>
                {/* Submit Review Section */}
                <section style={{ background: '#fff', padding: '2rem', borderRadius: '1.25rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', height: 'fit-content' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Send size={20} style={{ color: '#10b981' }} /> Write a New Review
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>Select Course</label>
                            <select
                                name="courseId"
                                value={formData.courseId}
                                onChange={handleInputChange}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none' }}
                            >
                                <option value="">-- Choose a course --</option>
                                {availableCourses.map(course => (
                                    <option key={course._id || course.id} value={course._id || course.id}>{course.title}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>Rating</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star
                                        key={star}
                                        size={24}
                                        style={{ cursor: 'pointer', fill: star <= formData.rating ? '#f59e0b' : 'none', color: star <= formData.rating ? '#f59e0b' : '#cbd5e1' }}
                                        onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                                    />
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>Your Experience</label>
                            <textarea
                                name="comment"
                                value={formData.comment}
                                onChange={handleInputChange}
                                placeholder="What did you think of the course?"
                                rows="4"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', resize: 'none' }}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                width: '100%',
                                background: '#10b981',
                                color: '#fff',
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                border: 'none',
                                fontWeight: 700,
                                cursor: 'pointer',
                                opacity: isSubmitting ? 0.7 : 1,
                                transition: 'background 0.2s'
                            }}
                        >
                            {isSubmitting ? 'Submitting...' : 'Post Review'}
                        </button>
                    </form>
                </section>

                {/* Review History Section */}
                <section>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MessageSquare size={20} style={{ color: '#10b981' }} /> My Review History
                    </h2>

                    {isReviewsLoading ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <div style={{ width: '30px', height: '30px', border: '3px solid #f3f3f3', borderTop: '3px solid #10b981', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 10px' }} />
                            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Loading history...</p>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div style={{ background: '#f8fafc', padding: '3rem', borderRadius: '1.25rem', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                            <p style={{ color: '#64748b' }}>You haven't submitted any reviews yet.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {reviews.map(review => (
                                <div key={review._id} style={{ background: '#fff', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b' }}>{review.courseName}</h3>
                                            <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem' }}>
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star
                                                        key={star}
                                                        size={14}
                                                        style={{ fill: star <= review.rating ? '#f59e0b' : 'none', color: star <= review.rating ? '#f59e0b' : '#cbd5e1' }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <Clock size={12} /> {new Date(review.createdAt).toLocaleDateString()}
                                            </span>

                                            <button
                                                onClick={() => handleDelete(review._id)}
                                                disabled={deletingIds.has(review._id)}
                                                aria-label="Delete review"
                                                title="Delete this review"
                                                className="std-delete-btn"
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#94a3b8',
                                                    cursor: 'pointer',
                                                    padding: '0.25rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    borderRadius: '0.375rem'
                                                }}
                                            >
                                                {deletingIds.has(review._id) ? (
                                                    <Loader2 size={16} className="animate-spin" />
                                                ) : (
                                                    <Trash2 size={16} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <p style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1rem' }}>"{review.comment}"</p>

                                    {/* Admin Reply */}
                                    {review.adminReply ? (
                                        <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '0.75rem', borderLeft: '4px solid #10b981' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#065f46' }}>Admin Response</span>
                                                <span style={{ fontSize: '0.75rem', color: '#65a30d' }}>• {new Date(review.repliedAt).toLocaleDateString()}</span>
                                            </div>
                                            <p style={{ color: '#166534', fontSize: '0.875rem', fontStyle: 'italic' }}>{review.adminReply}</p>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: '#f1f5f9', color: '#64748b', fontSize: '0.75rem', fontWeight: 600, borderRadius: '999px' }}>
                                            Response Pending
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
