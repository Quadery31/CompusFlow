import { useNavigate } from 'react-router-dom';

function NoteCard({ note }) {
    const navigate = useNavigate();

    const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div
            className="note-card"
            onClick={() => navigate(`/notes/${note._id}`)}
        >
            {/* Header badges */}
            <div className="note-card-header">
                <span className="note-badge note-subject-badge">{note.subject}</span>
                <span className="note-badge note-semester-badge">Sem {note.semester}</span>
            </div>

            {/* Title */}
            <h3 className="card-title">{note.title}</h3>

            {/* Description preview */}
            {note.description && (
                <p className="card-description">
                    {note.description.length > 100
                        ? note.description.slice(0, 100) + '...'
                        : note.description}
                </p>
            )}

            {/* Footer */}
            <div className="card-footer">
                <div className="note-stats">
                    <span className="note-stat">▲ {note.upvotes || 0}</span>
                    <span className="note-stat">
                        💬 {(note.comments || []).length}
                    </span>
                    <span className="note-stat">📄 PDF</span>
                </div>
                <span className="card-date">{formattedDate}</span>
            </div>
        </div>
    );
}

export default NoteCard;
