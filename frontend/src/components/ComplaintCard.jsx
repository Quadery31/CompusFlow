import { useNavigate } from 'react-router-dom';

const STATUS_CONFIG = {
    open: { label: 'Open', className: 'status-open' },
    discussion: { label: 'Discussion', className: 'status-discussion' },
    escalated: { label: 'Escalated', className: 'status-escalated' },
    resolved: { label: 'Resolved', className: 'status-resolved' },
};

function ComplaintCard({ complaint }) {
    const navigate = useNavigate();
    const statusInfo = STATUS_CONFIG[complaint.status] || STATUS_CONFIG.open;

    const formattedDate = new Date(complaint.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div
            className={`complaint-card ${complaint.status === 'resolved' ? 'complaint-resolved' : ''}`}
            onClick={() => navigate(`/complaints/${complaint._id}`)}
        >
            {/* Header */}
            <div className="complaint-card-header">
                <span className="category-badge">{complaint.category}</span>
                <span className={`complaint-status-badge ${statusInfo.className}`}>
                    {statusInfo.label}
                </span>
            </div>

            {/* Title */}
            <h3 className="card-title">{complaint.title}</h3>

            {/* Description preview */}
            {complaint.description && (
                <p className="card-description">
                    {complaint.description.length > 100
                        ? complaint.description.slice(0, 100) + '...'
                        : complaint.description}
                </p>
            )}

            {/* Footer */}
            <div className="card-footer">
                <div className="complaint-card-stats">
                    <span className="complaint-stat">▲ {complaint.upvotes}</span>
                    <span className="complaint-stat">
                        💬 {(complaint.comments || []).length}
                    </span>
                    {!complaint.isAnonymous && complaint.displayName && (
                        <span className="complaint-stat complaint-author">
                            — {complaint.displayName}
                        </span>
                    )}
                </div>
                <span className="card-date">{formattedDate}</span>
            </div>
        </div>
    );
}

export default ComplaintCard;
