import { useState, useEffect, useCallback } from 'react';
import { getEvents, createEvent, deleteEvent } from '../services/eventService';
import EventFilterBar from '../components/EventFilterBar';
import EventForm from '../components/EventForm';
import EventCard from '../components/EventCard';

function Events() {
    const [events, setEvents] = useState([]);
    const [filter, setFilter] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getEvents(filter);
            setEvents(data);
        } catch (err) {
            console.error('Failed to fetch events:', err);
            setError('Failed to load events. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleCreate = async (formData) => {
        const newEvent = await createEvent(formData);
        setEvents((prev) => [newEvent, ...prev]);
        setShowForm(false);
        showToast('Event created successfully! 🎉');
    };

    const handleDelete = async (id) => {
        await deleteEvent(id);
        setEvents((prev) => prev.filter((ev) => ev._id !== id));
        showToast('Event deleted.', 'info');
    };

    return (
        <div className="lost-found-page">
            {/* Toast */}
            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <header className="page-header">
                <div className="header-content">
                    <h1>🗓️ Campus Events</h1>
                    <p className="header-subtitle">
                        Discover, create, and track campus events
                    </p>
                </div>
                <button
                    className="add-btn"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? '✕ Cancel' : '+ Create Event'}
                </button>
            </header>

            {/* Form */}
            {showForm && (
                <EventForm
                    onSubmit={handleCreate}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {/* Filter */}
            <EventFilterBar activeFilter={filter} onFilterChange={setFilter} />

            {/* Error */}
            {error && (
                <div className="error-banner">
                    <span>⚠️ {error}</span>
                    <button className="retry-btn" onClick={fetchEvents}>Retry</button>
                </div>
            )}

            {/* Content */}
            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading events...</p>
                </div>
            ) : !error && events.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>No events found. Be the first to create one!</p>
                    <button className="add-btn" onClick={() => setShowForm(true)}>
                        + Create the first event
                    </button>
                </div>
            ) : (
                <div className="items-grid">
                    {events.map((ev) => (
                        <EventCard
                            key={ev._id}
                            event={ev}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Events;
