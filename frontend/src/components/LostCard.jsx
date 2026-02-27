import { useState } from 'react';

function LostCard({ item, onFound, onDelete }) {
    const isFound = item.type === 'found';
    const [marking, setMarking] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleFound = async () => {
        setMarking(true);
        try {
            await onFound(item._id);
        } finally {
            setMarking(false);
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
        <div className={`item-card ${item.type} ${isFound ? 'resolved' : ''}`}>
            {item.imageUrl && (
                <div className="card-image">
                    <img src={item.imageUrl} alt={item.title} loading="lazy" />
                </div>
            )}

            <div className="card-header">
                <span className={`type-badge ${item.type}`}>
                    {item.type === 'lost' ? '🔍 Lost' : '✅ Found'}
                </span>
                <span className={`status-badge ${isFound ? 'resolved' : 'open'}`}>
                    {isFound ? '🟢 Found' : '🟡 Open'}
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
                    {!isFound ? (
                        <button
                            className="action-btn resolve-btn"
                            onClick={handleFound}
                            disabled={marking}
                        >
                            {marking ? '...' : '✅ Found'}
                        </button>
                    ) : (
                        <span className="resolved-tag">Found</span>
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
