import { useState, useEffect } from 'react';
import API from '../api';
import FilterBar from './FilterBar';
import ItemForm from './ItemForm';
import ItemCard from './ItemCard';

function LostFoundPage() {
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const params = filter !== 'all' ? { type: filter } : {};
            const { data } = await API.get('/lost', { params });
            setItems(data.data);
        } catch (err) {
            console.error('Failed to fetch items:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [filter]);

    const handleCreate = async (formData) => {
        await API.post('/lost', formData);
        setShowForm(false);
        fetchItems();
    };

    const handleResolve = async (id) => {
        await API.put(`/lost/${id}`, { status: 'resolved' });
        fetchItems();
    };

    const handleDelete = async (id) => {
        await API.delete(`/lost/${id}`);
        fetchItems();
    };

    return (
        <div className="lost-found-page">
            <header className="page-header">
                <div className="header-content">
                    <h1>📦 Lost & Found</h1>
                    <p className="header-subtitle">
                        Report lost items or help reunite found ones with their owners.
                    </p>
                </div>
                <button
                    className="add-btn"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? '✕ Cancel' : '+ Report Item'}
                </button>
            </header>

            {showForm && <ItemForm onItemCreated={handleCreate} />}

            <FilterBar activeFilter={filter} onFilterChange={setFilter} />

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading items...</p>
                </div>
            ) : items.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>No items found. Be the first to report one!</p>
                </div>
            ) : (
                <div className="items-grid">
                    {items.map((item) => (
                        <ItemCard
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

export default LostFoundPage;
