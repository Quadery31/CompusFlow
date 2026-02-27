import { useState } from 'react';

function EventForm({ onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        organizer: '',
        registrationLink: '',
        category: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Prevent past date selection – today's date as min
    const today = new Date().toISOString().split('T')[0];

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

        if (!formData.date) {
            setError('Date is required');
            return;
        }

        setLoading(true);
        try {
            const payload = { ...formData };
            // Strip empty optional fields
            Object.keys(payload).forEach((key) => {
                if (typeof payload[key] === 'string' && !payload[key].trim()) {
                    delete payload[key];
                }
            });

            await onSubmit(payload);
            setFormData({
                title: '',
                description: '',
                date: '',
                time: '',
                venue: '',
                organizer: '',
                registrationLink: '',
                category: '',
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
                    <h2>🗓️ Create Event</h2>
                    <button type="button" className="form-close-btn" onClick={onCancel} aria-label="Close form">
                        ✕
                    </button>
                </div>

                {error && <div className="form-error">{error}</div>}

                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="ev-title">Title *</label>
                        <input
                            id="ev-title"
                            name="title"
                            type="text"
                            placeholder="e.g. Hackathon 2026"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="ev-category">Category</label>
                        <select
                            id="ev-category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="">Select category</option>
                            <option value="tech">Tech</option>
                            <option value="cultural">Cultural</option>
                            <option value="sports">Sports</option>
                            <option value="academic">Academic</option>
                            <option value="workshop">Workshop</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="ev-description">Description</label>
                        <textarea
                            id="ev-description"
                            name="description"
                            placeholder="Describe the event, what to expect..."
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="ev-date">Date *</label>
                        <input
                            id="ev-date"
                            name="date"
                            type="date"
                            min={today}
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="ev-time">Time</label>
                        <input
                            id="ev-time"
                            name="time"
                            type="time"
                            value={formData.time}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="ev-venue">Venue</label>
                        <input
                            id="ev-venue"
                            name="venue"
                            type="text"
                            placeholder="e.g. Auditorium, Block C"
                            value={formData.venue}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="ev-organizer">Organizer</label>
                        <input
                            id="ev-organizer"
                            name="organizer"
                            type="text"
                            placeholder="e.g. Tech Club"
                            value={formData.organizer}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="ev-link">Registration Link (optional)</label>
                        <input
                            id="ev-link"
                            name="registrationLink"
                            type="url"
                            placeholder="https://forms.google.com/..."
                            value={formData.registrationLink}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Creating...' : '🚀 Create Event'}
                </button>
            </form>
        </div>
    );
}

export default EventForm;
