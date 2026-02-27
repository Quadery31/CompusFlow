import { useState } from 'react';

function DoubtForm({ onSubmit, onCancel }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [subject, setSubject] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const subjects = ['DSA', 'DBMS', 'OS', 'CN', 'OOPs', 'Web Dev', 'ML', 'Math', 'Other'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!title.trim() || !description.trim() || !subject) {
            setError('All fields are required.');
            return;
        }

        setSubmitting(true);
        try {
            await onSubmit({ title: title.trim(), description: description.trim(), subject });
            setTitle('');
            setDescription('');
            setSubject('');
        } catch (err) {
            setError(err.message || 'Failed to post doubt.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="item-form-wrapper">
            <form className="item-form" onSubmit={handleSubmit}>
                <div className="form-header-row">
                    <h2>❓ Ask a Doubt</h2>
                    <button type="button" className="form-close-btn" onClick={onCancel}>✕</button>
                </div>

                {error && <div className="form-error">{error}</div>}

                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="doubt-title">Title</label>
                        <input
                            id="doubt-title"
                            type="text"
                            placeholder="What's your doubt?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="doubt-subject">Subject</label>
                        <select
                            id="doubt-subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        >
                            <option value="">Select Subject</option>
                            {subjects.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="doubt-description">Description</label>
                        <textarea
                            id="doubt-description"
                            placeholder="Describe your doubt in detail..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={submitting}
                >
                    {submitting ? 'Posting...' : '🚀 Post Doubt'}
                </button>
            </form>
        </div>
    );
}

export default DoubtForm;
