import { useState, useEffect, useCallback } from 'react';
import { getDoubts, createDoubt, deleteAllDoubts } from '../services/doubtService';
import DoubtFilterBar from '../components/DoubtFilterBar';
import DoubtForm from '../components/DoubtForm';
import DoubtCard from '../components/DoubtCard';

function Doubts() {
    const [doubts, setDoubts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedSort, setSelectedSort] = useState('latest');
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const fetchDoubts = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getDoubts(selectedSubject, selectedSort);
            setDoubts(data);
        } catch (err) {
            console.error('Failed to fetch doubts:', err);
            setError('Failed to load doubts. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    }, [selectedSubject, selectedSort]);

    useEffect(() => {
        fetchDoubts();
    }, [fetchDoubts]);

    const handleCreate = async (formData) => {
        const newDoubt = await createDoubt(formData);
        setDoubts((prev) => [newDoubt, ...prev]);
        setShowForm(false);
        showToast('Doubt posted successfully! 🎯');
    };

    const handleDeleteAll = async () => {
        if (!window.confirm('Delete ALL doubts? This cannot be undone.')) return;
        try {
            await deleteAllDoubts();
            setDoubts([]);
            showToast('All doubts deleted.', 'info');
        } catch {
            showToast('Failed to delete doubts.', 'error');
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
                    <h1>❓ Peer Doubts</h1>
                    <p className="header-subtitle">
                        Ask, answer, and solve academic doubts together
                    </p>
                </div>
                <div className="header-actions">
                    <button
                        className="add-btn"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? '✕ Cancel' : '+ Ask a Doubt'}
                    </button>
                    {doubts.length > 0 && (
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
                <DoubtForm
                    onSubmit={handleCreate}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {/* Filter */}
            <DoubtFilterBar
                selectedSubject={selectedSubject}
                onSubjectChange={setSelectedSubject}
                selectedSort={selectedSort}
                onSortChange={setSelectedSort}
            />

            {/* Error */}
            {error && (
                <div className="error-banner">
                    <span>⚠️ {error}</span>
                    <button className="retry-btn" onClick={fetchDoubts}>Retry</button>
                </div>
            )}

            {/* Content */}
            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading doubts...</p>
                </div>
            ) : !error && doubts.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">🤔</span>
                    <p>No doubts posted yet. Be the first to ask!</p>
                    <button className="add-btn" onClick={() => setShowForm(true)}>
                        + Ask the first doubt
                    </button>
                </div>
            ) : (
                <div className="items-grid">
                    {doubts.map((doubt) => (
                        <DoubtCard key={doubt._id} doubt={doubt} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Doubts;
