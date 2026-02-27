import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoubtById, addAnswer, upvoteAnswer, markDoubtSolved, deleteDoubt } from '../services/doubtService';
import AnswerCard from '../components/AnswerCard';
import AnswerForm from '../components/AnswerForm';

function DoubtDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doubt, setDoubt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const fetchDoubt = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getDoubtById(id);
            setDoubt(data);
        } catch (err) {
            console.error('Failed to fetch doubt:', err);
            setError('Doubt not found or failed to load.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDoubt();
    }, [fetchDoubt]);

    const handleAddAnswer = async (text) => {
        const updated = await addAnswer(id, text);
        setDoubt(updated);
        showToast('Answer posted! 💡');
    };

    const handleUpvote = async (answerId) => {
        // Optimistic update
        setDoubt((prev) => ({
            ...prev,
            answers: prev.answers.map((a) =>
                a._id === answerId ? { ...a, upvotes: a.upvotes + 1 } : a
            ),
        }));
        try {
            await upvoteAnswer(id, answerId);
        } catch {
            // Revert on failure
            setDoubt((prev) => ({
                ...prev,
                answers: prev.answers.map((a) =>
                    a._id === answerId ? { ...a, upvotes: a.upvotes - 1 } : a
                ),
            }));
            showToast('Failed to upvote.', 'error');
        }
    };

    const handleSolve = async () => {
        try {
            const updated = await markDoubtSolved(id);
            setDoubt(updated);
            showToast('Doubt marked as solved! ✅');
        } catch {
            showToast('Failed to mark as solved.', 'error');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`Delete "${doubt.title}"? This cannot be undone.`)) return;
        try {
            await deleteDoubt(id);
            navigate('/doubts');
        } catch {
            showToast('Failed to delete doubt.', 'error');
        }
    };

    if (loading) {
        return (
            <div className="lost-found-page">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading doubt...</p>
                </div>
            </div>
        );
    }

    if (error || !doubt) {
        return (
            <div className="lost-found-page">
                <div className="error-banner">
                    <span>⚠️ {error || 'Doubt not found.'}</span>
                    <button className="retry-btn" onClick={() => navigate('/doubts')}>← Back to Doubts</button>
                </div>
            </div>
        );
    }

    const formattedDate = new Date(doubt.createdAt).toLocaleDateString('en-US', {
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
            <button className="back-btn" onClick={() => navigate('/doubts')}>
                ← Back to Doubts
            </button>

            {/* Doubt detail card */}
            <div className="doubt-detail-card">
                <div className="doubt-detail-header">
                    <div className="doubt-detail-badges">
                        <span className="subject-badge">{doubt.subject}</span>
                        <span className={`status-badge ${doubt.status}`}>
                            {doubt.status === 'solved' ? '✅ Solved' : '🟡 Open'}
                        </span>
                    </div>
                    <span className="card-date">{formattedDate}</span>
                </div>

                <h2 className="doubt-detail-title">{doubt.title}</h2>
                <p className="doubt-detail-description">{doubt.description}</p>

                <div className="doubt-detail-actions">
                    {doubt.status === 'open' && (
                        <button className="solve-btn" onClick={handleSolve}>
                            ✅ Mark as Solved
                        </button>
                    )}
                    <button className="action-btn delete-btn" onClick={handleDelete}>
                        🗑 Delete Doubt
                    </button>
                </div>
            </div>

            {/* Answers section */}
            <div className="answers-section">
                <h3 className="answers-heading">
                    💬 Answers ({(doubt.answers || []).length})
                </h3>

                {(doubt.answers || []).length === 0 ? (
                    <div className="empty-answers">
                        <p>No answers yet. Be the first to help!</p>
                    </div>
                ) : (
                    <div className="answers-list">
                        {doubt.answers.map((answer) => (
                            <AnswerCard
                                key={answer._id}
                                answer={answer}
                                onUpvote={handleUpvote}
                            />
                        ))}
                    </div>
                )}

                {/* Answer form */}
                <AnswerForm onSubmit={handleAddAnswer} />
            </div>
        </div>
    );
}

export default DoubtDetails;
