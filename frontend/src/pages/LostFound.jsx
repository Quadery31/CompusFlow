import { useState, useEffect, useCallback } from 'react';
import { getItems, createItem, resolveItem, deleteItem } from '../services/lostFoundService';
import FilterBar from '../components/FilterBar';
import LostForm from '../components/LostForm';
import LostCard from '../components/LostCard';

function LostFound() {
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [toast, setToast] = useState(null);

    // Auto-dismiss toast after 3 seconds
    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const fetchItems = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getItems(filter);
            setItems(data);
        } catch (err) {
            console.error('Failed to fetch items:', err);
            setError('Failed to load items. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleCreate = async (formData) => {
        const newItem = await createItem(formData);
        // Optimistic: prepend new item to list
        setItems((prev) => [newItem, ...prev]);
        setShowForm(false);
        showToast('Item reported successfully!');
    };

    const handleResolve = async (id) => {
        const updatedItem = await resolveItem(id);
        // Optimistic: update in-place
        setItems((prev) =>
            prev.map((item) => (item._id === id ? updatedItem : item))
        );
        showToast('Item marked as resolved.');
    };

    const handleDelete = async (id) => {
        await deleteItem(id);
        // Optimistic: remove from list
        setItems((prev) => prev.filter((item) => item._id !== id));
        showToast('Item deleted.', 'info');
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
                    <h1>📦 Lost & Found</h1>
                    <p className="header-subtitle">
                        Report or recover lost items on campus
                    </p>
                </div>
                <button
                    className="add-btn"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? '✕ Cancel' : '+ Report Item'}
                </button>
            </header>

            {/* Form */}
            {showForm && (
                <LostForm
                    onSubmit={handleCreate}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {/* Filter */}
            <FilterBar activeFilter={filter} onFilterChange={setFilter} />

            {/* Error */}
            {error && (
                <div className="error-banner">
                    <span>⚠️ {error}</span>
                    <button className="retry-btn" onClick={fetchItems}>Retry</button>
                </div>
            )}

            {/* Content */}
            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading items...</p>
                </div>
            ) : !error && items.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>No lost or found items reported yet.</p>
                    <button className="add-btn" onClick={() => setShowForm(true)}>
                        + Report the first item
                    </button>
                </div>
            ) : (
                <div className="items-grid">
                    {items.map((item) => (
                        <LostCard
                            key={item._id}
                            item={item}
                            onResolve={handleResolve}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default LostFound;
