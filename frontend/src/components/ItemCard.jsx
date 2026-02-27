function ItemCard({ item, onResolve, onDelete }) {
    const isResolved = item.status === 'resolved';

    return (
        <div className={`item-card ${item.type} ${isResolved ? 'resolved' : ''}`}>
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
                    {!isResolved && (
                        <button
                            className="action-btn resolve-btn"
                            onClick={() => onResolve(item._id)}
                        >
                            ✓ Resolve
                        </button>
                    )}
                    <button
                        className="action-btn delete-btn"
                        onClick={() => onDelete(item._id)}
                    >
                        🗑 Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ItemCard;
