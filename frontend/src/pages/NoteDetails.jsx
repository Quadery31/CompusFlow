import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getNoteById,
    upvoteNote,
    addNoteComment,
    deleteNote,
    deleteNoteComment,
    deleteAllNoteComments
} from '../services/noteService';
import CommentCard from '../components/CommentCard';
import CommentForm from '../components/CommentForm';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function NoteDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [toast, setToast] = useState(null);
    const [upvoting, setUpvoting] = useState(false);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const fetchNote = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getNoteById(id);
            setNote(data);
        } catch (err) {
            console.error('Failed to fetch note:', err);
            setError('Note not found or failed to load.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchNote();
    }, [fetchNote]);

    const handleUpvote = async () => {
        setNote((prev) => ({ ...prev, upvotes: (prev.upvotes || 0) + 1 }));
        setUpvoting(true);
        try {
            await upvoteNote(id);
        } catch {
            setNote((prev) => ({ ...prev, upvotes: (prev.upvotes || 1) - 1 }));
            showToast('Failed to upvote.', 'error');
        } finally {
            setTimeout(() => setUpvoting(false), 600);
        }
    };

    const handleAddComment = async (text) => {
        const updated = await addNoteComment(id, text);
        setNote(updated);
        showToast('Comment posted! 💬');
    };

    const handleDeleteNote = async () => {
        if (!window.confirm(`Delete "${note?.title}"? This cannot be undone.`)) return;
        try {
            await deleteNote(id);
            navigate('/notes');
        } catch {
            showToast('Failed to delete note.', 'error');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Delete this comment?')) return;
        try {
            const updated = await deleteNoteComment(id, commentId);
            setNote(updated);
            showToast('Comment deleted.', 'info');
        } catch {
            showToast('Failed to delete comment.', 'error');
        }
    };

    const handleDeleteAllComments = async () => {
        if (!window.confirm('Delete ALL comments? This cannot be undone.')) return;
        try {
            const updated = await deleteAllNoteComments(id);
            setNote(updated);
            showToast('All comments deleted.', 'info');
        } catch {
            showToast('Failed to delete comments.', 'error');
        }
    };

    const fileUrl = note?.fileUrl ? `${API_BASE}/${note.fileUrl}` : '';

    if (loading) {
        return (
            <div className="lost-found-page">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading note...</p>
                </div>
            </div>
        );
    }

    if (error || !note) {
        return (
            <div className="lost-found-page">
                <div className="error-banner">
                    <span>⚠️ {error || 'Note not found.'}</span>
                    <button className="retry-btn" onClick={() => navigate('/notes')}>← Back</button>
                </div>
            </div>
        );
    }

    const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
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
            <button className="back-btn" onClick={() => navigate('/notes')}>
                ← Back to Notes
            </button>

            {/* Note detail card */}
            <div className="note-detail-card">
                <div className="note-detail-header">
                    <div className="note-detail-badges">
                        <span className="note-badge note-subject-badge">{note.subject}</span>
                        <span className="note-badge note-semester-badge">Semester {note.semester}</span>
                        {note.uploadedBy && (
                            <span className="note-author-badge">
                                by {note.uploadedBy}
                            </span>
                        )}
                    </div>
                    <span className="card-date">{formattedDate}</span>
                </div>

                <h2 className="doubt-detail-title">{note.title}</h2>

                {note.description && (
                    <p className="doubt-detail-description">{note.description}</p>
                )}

                {/* Actions row */}
                <div className="note-detail-actions">
                    <button
                        className={`upvote-btn complaint-upvote ${upvoting ? 'upvoting' : ''}`}
                        onClick={handleUpvote}
                        disabled={upvoting}
                    >
                        ▲ {note.upvotes || 0} Upvote{(note.upvotes || 0) !== 1 ? 's' : ''}
                    </button>

                    <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="action-btn note-download-btn"
                    >
                        ⬇ Download PDF
                    </a>

                    <button className="action-btn delete-btn" onClick={handleDeleteNote}>
                        🗑 Delete Note
                    </button>
                </div>

                {/* PDF Viewer */}
                {fileUrl && (
                    <div className="pdf-viewer-wrapper">
                        <h3 className="pdf-viewer-heading">📄 Document Preview</h3>
                        <iframe
                            src={fileUrl}
                            className="pdf-viewer"
                            title="PDF Viewer"
                        />
                        <p className="pdf-fallback">
                            PDF not loading?{' '}
                            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                Open in new tab
                            </a>
                        </p>
                    </div>
                )}
            </div>

            {/* Comments section */}
            <div className="answers-section">
                <div className="comments-header-row">
                    <h3 className="answers-heading">
                        💬 Comments ({(note.comments || []).length})
                    </h3>
                    {(note.comments || []).length > 0 && (
                        <button
                            className="action-btn delete-btn"
                            onClick={handleDeleteAllComments}
                        >
                            🗑 Delete All
                        </button>
                    )}
                </div>

                {(note.comments || []).length === 0 ? (
                    <div className="empty-answers">
                        <p>No comments yet. Start the discussion.</p>
                    </div>
                ) : (
                    <div className="answers-list">
                        {note.comments.map((comment) => (
                            <CommentCard
                                key={comment._id}
                                comment={comment}
                                onDelete={() => handleDeleteComment(comment._id)}
                            />
                        ))}
                    </div>
                )}

                <CommentForm onSubmit={handleAddComment} />
            </div>
        </div>
    );
}

export default NoteDetails;
