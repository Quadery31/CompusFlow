import { useState } from 'react';

function ComplaintForm({ onSubmit, onCancel }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(true);
    const [displayName, setDisplayName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const categories = ['Mess', 'Hostel', 'Academics', 'Infrastructure', 'Other'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!title.trim() || !description.trim() || !category) {
            setError('Title, description, and category are required.');
            return;
        }

        if (!isAnonymous && !displayName.trim()) {
            setError('Display name is required when not posting anonymously.');
            return;
        }

        setSubmitting(true);
        try {
            const data = {
                title: title.trim(),
                description: description.trim(),
                category,
                isAnonymous,
            };
            if (!isAnonymous) data.displayName = displayName.trim();

            await onSubmit(data);
            setTitle('');
            setDescription('');
            setCategory('');
            setIsAnonymous(true);
            setDisplayName('');
        } catch (err) {
            setError(err.message || 'Failed to submit complaint.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="item-form-wrapper">
            <form className="item-form" onSubmit={handleSubmit}>
                <div className="form-header-row">
                    <h2>📢 Report an Issue</h2>
                    <button type="button" className="form-close-btn" onClick={onCancel}>✕</button>
                </div>

                {error && <div className="form-error">{error}</div>}

                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="complaint-title">Title</label>
                        <input
                            id="complaint-title"
                            type="text"
                            placeholder="Brief issue title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="complaint-category">Category</label>
                        <select
                            id="complaint-category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Select Category</option>
                            {categories.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="complaint-desc">Description</label>
                        <textarea
                            id="complaint-desc"
                            placeholder="Describe the issue in detail..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                        />
                    </div>

                    <div className="form-group full-width">
                        <label className="anonymous-toggle">
                            <input
                                type="checkbox"
                                checked={isAnonymous}
                                onChange={(e) => setIsAnonymous(e.target.checked)}
                            />
                            <span>Post anonymously</span>
                        </label>
                    </div>

                    {!isAnonymous && (
                        <div className="form-group full-width">
                            <label htmlFor="complaint-name">Your Name</label>
                            <input
                                id="complaint-name"
                                type="text"
                                placeholder="Display name"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={submitting}
                >
                    {submitting ? 'Submitting...' : '📢 Submit Complaint'}
                </button>
            </form>
        </div>
    );
}

export default ComplaintForm;
