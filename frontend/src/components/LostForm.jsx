import { useState } from 'react';

function LostForm({ onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'lost',
        location: '',
        contactInfo: '',
        imageUrl: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.title.trim()) {
            setError('Title is required');
            return;
        }

        setLoading(true);
        try {
            // Strip empty optional fields before sending
            const payload = { ...formData };
            Object.keys(payload).forEach((key) => {
                if (typeof payload[key] === 'string' && !payload[key].trim()) {
                    delete payload[key];
                }
            });

            await onSubmit(payload);
            setFormData({
                title: '',
                description: '',
                type: 'lost',
                location: '',
                contactInfo: '',
                imageUrl: '',
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="item-form-wrapper">
            <form className="item-form" onSubmit={handleSubmit}>
                <div className="form-header-row">
                    <h2>📝 Report an Item</h2>
                    <button type="button" className="form-close-btn" onClick={onCancel} aria-label="Close form">
                        ✕
                    </button>
                </div>

                {error && <div className="form-error">{error}</div>}

                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="title">Title *</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="e.g. Blue Backpack"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="type">Type *</label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                        >
                            <option value="lost">Lost</option>
                            <option value="found">Found</option>
                        </select>
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Describe the item, any identifying features..."
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="location">Location</label>
                        <input
                            id="location"
                            name="location"
                            type="text"
                            placeholder="e.g. Library, Block A"
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="contactInfo">Contact Info</label>
                        <input
                            id="contactInfo"
                            name="contactInfo"
                            type="text"
                            placeholder="e.g. email or phone"
                            value={formData.contactInfo}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="imageUrl">Image URL (optional)</label>
                        <input
                            id="imageUrl"
                            name="imageUrl"
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            value={formData.imageUrl}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Submitting...' : '🚀 Submit Report'}
                </button>
            </form>
        </div>
    );
}

export default LostForm;
