import { useState, useEffect, useCallback } from 'react';
import { getComplaints, createComplaint, deleteAllComplaints } from '../services/complaintService';
import ComplaintFilterBar from '../components/ComplaintFilterBar';
import ComplaintForm from '../components/ComplaintForm';
import ComplaintCard from '../components/ComplaintCard';

function Complaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSort, setSelectedSort] = useState('latest');
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const fetchComplaints = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getComplaints(selectedCategory, selectedSort);
            setComplaints(data);
        } catch (err) {
            console.error('Failed to fetch complaints:', err);
            setError('Failed to load complaints. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    }, [selectedCategory, selectedSort]);

    useEffect(() => {
        fetchComplaints();
    }, [fetchComplaints]);

    const handleCreate = async (formData) => {
        const newComplaint = await createComplaint(formData);
        setComplaints((prev) => [newComplaint, ...prev]);
        setShowForm(false);
        showToast('Complaint submitted successfully! 📢');
    };

    const handleDeleteAll = async () => {
        if (!window.confirm('Delete ALL complaints? This cannot be undone.')) return;
        try {
            await deleteAllComplaints();
            setComplaints([]);
            showToast('All complaints deleted.', 'info');
        } catch {
            showToast('Failed to delete complaints.', 'error');
        }
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
                    <h1>📢 Community Complaints</h1>
                    <p className="header-subtitle">
                        Report issues, discuss solutions, drive change together
                    </p>
                </div>
                <div className="header-actions">
                    <button
                        className="add-btn"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? '✕ Cancel' : '+ Report Issue'}
                    </button>
                    {complaints.length > 0 && (
                        <button
                            className="action-btn delete-btn"
                            onClick={handleDeleteAll}
                        >
                            🗑 Delete All
                        </button>
                    )}
                </div>
            </header>

            {/* Form */}
            {showForm && (
                <ComplaintForm
                    onSubmit={handleCreate}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {/* Filter */}
            <ComplaintFilterBar
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedSort={selectedSort}
                onSortChange={setSelectedSort}
            />

            {/* Error */}
            {error && (
                <div className="error-banner">
                    <span>⚠️ {error}</span>
                    <button className="retry-btn" onClick={fetchComplaints}>Retry</button>
                </div>
            )}

            {/* Content */}
            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading complaints...</p>
                </div>
            ) : !error && complaints.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>No complaints raised yet.</p>
                    <button className="add-btn" onClick={() => setShowForm(true)}>
                        + Report the first issue
                    </button>
                </div>
            ) : (
                <div className="items-grid">
                    {complaints.map((complaint) => (
                        <ComplaintCard key={complaint._id} complaint={complaint} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Complaints;
