import { useNavigate } from 'react-router-dom';

function DoubtCard({ doubt }) {
    const navigate = useNavigate();

    const totalUpvotes = (doubt.answers || []).reduce((sum, a) => sum + a.upvotes, 0);

    const formattedDate = new Date(doubt.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div
            className={`doubt-card ${doubt.status === 'solved' ? 'doubt-solved' : ''}`}
            onClick={() => navigate(`/doubts/${doubt._id}`)}
        >
            {/* Header row */}
            <div className="doubt-card-header">
                <span className="subject-badge">{doubt.subject}</span>
                <span className={`status-badge ${doubt.status}`}>
                    {doubt.status === 'solved' ? '✅ Solved' : '🟡 Open'}
                </span>
            </div>

            {/* Title */}
            <h3 className="card-title">{doubt.title}</h3>

            {/* Description preview */}
            {doubt.description && (
                <p className="card-description">
                    {doubt.description.length > 100
                        ? doubt.description.slice(0, 100) + '...'
                        : doubt.description}
                </p>
            )}

            {/* Footer */}
            <div className="card-footer">
                <div className="doubt-card-stats">
                    <span className="doubt-stat">
                        💬 {(doubt.answers || []).length} answer{(doubt.answers || []).length !== 1 ? 's' : ''}
                    </span>
                    <span className="doubt-stat">
                        👍 {totalUpvotes} upvote{totalUpvotes !== 1 ? 's' : ''}
                    </span>
                </div>
                <span className="card-date">{formattedDate}</span>
            </div>
        </div>
    );
}

export default DoubtCard;
