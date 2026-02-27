import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getComplaintById,
    upvoteComplaint,
    addComment,
    updateComplaintStatus,
    deleteComplaint
} from '../services/complaintService';
import CommentCard from '../components/CommentCard';
import CommentForm from '../components/CommentForm';

const STATUS_OPTIONS = [
    { value: 'open', label: 'Open' },
    { value: 'discussion', label: 'Under Discussion' },
    { value: 'escalated', label: 'Escalated' },
    { value: 'resolved', label: 'Resolved' },
];

const STATUS_CONFIG = {
    open: { label: 'Open', className: 'status-open' },
    discussion: { label: 'Under Discussion', className: 'status-discussion' },
    escalated: { label: 'Escalated', className: 'status-escalated' },
    resolved: { label: 'Resolved', className: 'status-resolved' },
};

function ComplaintDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [toast, setToast] = useState(null);
    const [upvoting, setUpvoting] = useState(false);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const fetchComplaint = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getComplaintById(id);
            setComplaint(data);
        } catch (err) {
            console.error('Failed to fetch complaint:', err);
            setError('Complaint not found or failed to load.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchComplaint();
    }, [fetchComplaint]);

    const handleUpvote = async () => {
        // Optimistic update
        setComplaint((prev) => ({ ...prev, upvotes: prev.upvotes + 1 }));
        setUpvoting(true);
        try {
            await upvoteComplaint(id);
        } catch {
            setComplaint((prev) => ({ ...prev, upvotes: prev.upvotes - 1 }));
            showToast('Failed to upvote.', 'error');
        } finally {
            setTimeout(() => setUpvoting(false), 600);
        }
    };

    const handleAddComment = async (text) => {
        const updated = await addComment(id, text);
        setComplaint(updated);
        showToast('Comment posted! 💬');
    };

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        try {
            const updated = await updateComplaintStatus(id, newStatus);
            setComplaint(updated);
            showToast(`Status updated to "${STATUS_CONFIG[newStatus]?.label || newStatus}"`);
        } catch {
            showToast('Failed to update status.', 'error');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`Delete "${complaint.title}"? This cannot be undone.`)) return;
        try {
            await deleteComplaint(id);
            navigate('/complaints');
        } catch {
            showToast('Failed to delete complaint.', 'error');
        }
    };

    if (loading) {
        return (
            <div className="lost-found-page">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading complaint...</p>
                </div>
            </div>
        );
    }

    if (error || !complaint) {
        return (
            <div className="lost-found-page">
                <div className="error-banner">
                    <span>⚠️ {error || 'Complaint not found.'}</span>
                    <button className="retry-btn" onClick={() => navigate('/complaints')}>← Back</button>
                </div>
            </div>
        );
    }

    const statusInfo = STATUS_CONFIG[complaint.status] || STATUS_CONFIG.open;

    const formattedDate = new Date(complaint.createdAt).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className="lost-found-page">
            {/* Toast */}
            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.message}
                </div>
            )}

            {/* Back button */}
            <button className="back-btn" onClick={() => navigate('/complaints')}>
                ← Back to Complaints
            </button>

            {/* Complaint detail card */}
            <div className="doubt-detail-card">
                <div className="doubt-detail-header">
                    <div className="doubt-detail-badges">
                        <span className="category-badge">{complaint.category}</span>
                        <span className={`complaint-status-badge ${statusInfo.className}`}>
                            {statusInfo.label}
                        </span>
                        {!complaint.isAnonymous && complaint.displayName && (
                            <span className="complaint-author-badge">
                                by {complaint.displayName}
                            </span>
                        )}
                    </div>
                    <span className="card-date">{formattedDate}</span>
                </div>

                <h2 className="doubt-detail-title">{complaint.title}</h2>
                <p className="doubt-detail-description">{complaint.description}</p>

                <div className="complaint-detail-actions">
                    {/* Upvote button */}
                    <button
                        className={`upvote-btn complaint-upvote ${upvoting ? 'upvoting' : ''}`}
                        onClick={handleUpvote}
                        disabled={upvoting}
                    >
                        ▲ {complaint.upvotes} Upvote{complaint.upvotes !== 1 ? 's' : ''}
                    </button>

                    {/* Status dropdown */}
                    <div className="status-dropdown-wrapper">
                        <label htmlFor="status-select">Status:</label>
                        <select
                            id="status-select"
                            value={complaint.status}
                            onChange={handleStatusChange}
                            className="status-dropdown"
                        >
                            {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Delete button */}
                    <button className="action-btn delete-btn" onClick={handleDelete}>
                        🗑 Delete
                    </button>
                </div>
            </div>

            {/* Comments section */}
            <div className="answers-section">
                <h3 className="answers-heading">
                    💬 Comments ({(complaint.comments || []).length})
                </h3>

                {(complaint.comments || []).length === 0 ? (
                    <div className="empty-answers">
                        <p>No comments yet. Start the discussion.</p>
                    </div>
                ) : (
                    <div className="answers-list">
                        {complaint.comments.map((comment) => (
                            <CommentCard key={comment._id} comment={comment} />
                        ))}
                    </div>
                )}

                {/* Comment form */}
                <CommentForm onSubmit={handleAddComment} />
            </div>
        </div>
    );
}

export default ComplaintDetails;
