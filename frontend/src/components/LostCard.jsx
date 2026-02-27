import { useState } from 'react';

function LostCard({ item, onResolve, onDelete }) {
    const isResolved = item.status === 'resolved';
    const [resolving, setResolving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleResolve = async () => {
        setResolving(true);
        try {
            await onResolve(item._id);
        } finally {
            setResolving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
        setDeleting(true);
        try {
            await onDelete(item._id);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className={`item-card ${item.type} ${isResolved ? 'resolved' : ''}`}>
            {item.imageUrl && (
                <div className="card-image">
                    <img src={item.imageUrl} alt={item.title} loading="lazy" />
                </div>
            )}

            <div className="card-header">
                <span className={`type-badge ${item.type}`}>
                    {item.type === 'lost' ? '🔍 Lost' : '✅ Found'}
                </span>
                <span className={`status-badge ${item.status}`}>
                    {isResolved ? '🟢 Resolved' : '🟡 Open'}
                </span>
            </div>

            <h3 className="card-title">{item.title}</h3>

            {item.description && (
                <p className="card-description">{item.description}</p>
            )}

            <div className="card-details">
                {item.location && (
                    <span className="detail">
                        <span className="detail-icon">📍</span> {item.location}
                    </span>
                )}
                {item.contactInfo && (
                    <span className="detail">
                        <span className="detail-icon">📧</span> {item.contactInfo}
                    </span>
                )}
            </div>

            <div className="card-footer">
                <span className="card-date">
                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                    })}
                </span>
                <div className="card-actions">
                    {!isResolved ? (
                        <button
                            className="action-btn resolve-btn"
                            onClick={handleResolve}
                            disabled={resolving}
                        >
                            {resolving ? '...' : '✓ Resolve'}
                        </button>
                    ) : (
                        <span className="resolved-tag">Resolved</span>
                    )}
                    <button
                        className="action-btn delete-btn"
                        onClick={handleDelete}
                        disabled={deleting}
                    >
                        {deleting ? '...' : '🗑 Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LostCard;
