import { useState } from 'react';

/**
 * Compute the countdown label for an event date.
 */
function getCountdown(eventDate) {
    const now = new Date();
    const event = new Date(eventDate);

    // Zero out time for day-level comparison
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventStart = new Date(event.getFullYear(), event.getMonth(), event.getDate());

    const diffMs = eventStart - todayStart;
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return { label: '🟢 Today', className: 'countdown-today' };
    if (diffDays > 0) return { label: `🔜 ${diffDays} Day${diffDays > 1 ? 's' : ''} Left`, className: 'countdown-upcoming' };
    return { label: '✅ Event Completed', className: 'countdown-past' };
}

function EventCard({ event, onDelete }) {
    const [deleting, setDeleting] = useState(false);
    const countdown = getCountdown(event.date);

    const handleDelete = async () => {
        if (!window.confirm(`Delete "${event.title}"? This cannot be undone.`)) return;
        setDeleting(true);
        try {
            await onDelete(event._id);
        } finally {
            setDeleting(false);
        }
    };

    const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    const formattedTime = event.time
        ? new Date(`1970-01-01T${event.time}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
        })
        : null;

    return (
        <div className={`event-card ${countdown.className}`}>
            {/* Countdown badge */}
            <div className="event-countdown-row">
                <span className={`countdown-badge ${countdown.className}`}>
                    {countdown.label}
                </span>
                {event.category && (
                    <span className="category-badge">{event.category}</span>
                )}
            </div>

            <h3 className="card-title">{event.title}</h3>

            {event.description && (
                <p className="card-description">
                    {event.description.length > 120
                        ? event.description.slice(0, 120) + '...'
                        : event.description}
                </p>
            )}

            <div className="event-meta">
                <span className="detail">
                    <span className="detail-icon">📅</span> {formattedDate}
                    {formattedTime && ` • ${formattedTime}`}
                </span>
                {event.venue && (
                    <span className="detail">
                        <span className="detail-icon">📍</span> {event.venue}
                    </span>
                )}
                {event.organizer && (
                    <span className="detail">
                        <span className="detail-icon">👤</span> {event.organizer}
                    </span>
                )}
            </div>

            <div className="card-footer">
                <div className="event-actions-left">
                    {event.registrationLink && (
                        <a
                            href={event.registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-btn register-btn"
                        >
                            📝 Register
                        </a>
                    )}
                </div>
                <button
                    className="action-btn delete-btn"
                    onClick={handleDelete}
                    disabled={deleting}
                >
                    {deleting ? '...' : '🗑 Delete'}
                </button>
            </div>
        </div>
    );
}

export default EventCard;
