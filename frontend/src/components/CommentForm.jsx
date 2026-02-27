import { useState } from 'react';

function CommentForm({ onSubmit }) {
    const [text, setText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        setSubmitting(true);
        try {
            await onSubmit(text.trim());
            setText('');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className="answer-form" onSubmit={handleSubmit}>
            <textarea
                placeholder="Add a comment..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
            />
            <button
                type="submit"
                className="submit-btn answer-submit-btn"
                disabled={submitting || !text.trim()}
            >
                {submitting ? 'Posting...' : '💬 Post Comment'}
            </button>
        </form>
    );
}

export default CommentForm;
