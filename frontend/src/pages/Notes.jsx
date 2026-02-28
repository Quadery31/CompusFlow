import { useState, useEffect, useCallback } from 'react';
import { getNotes, uploadNote, deleteAllNotes } from '../services/noteService';
import NoteFilterBar from '../components/NoteFilterBar';
import NoteForm from '../components/NoteForm';
import NoteCard from '../components/NoteCard';

function Notes() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedSort, setSelectedSort] = useState('latest');
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const fetchNotes = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getNotes(selectedSubject, selectedSemester, selectedSort);
            setNotes(data || []);
        } catch (err) {
            console.error('Failed to fetch notes:', err);
            setError('Failed to load notes. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    }, [selectedSubject, selectedSemester, selectedSort]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    const handleUpload = async (formData) => {
        const newNote = await uploadNote(formData);
        setNotes((prev) => [newNote, ...prev]);
        setShowForm(false);
        showToast('Note uploaded successfully! 📚');
    };

    const handleDeleteAll = async () => {
        if (!window.confirm('Delete ALL notes? This cannot be undone.')) return;
        try {
            await deleteAllNotes();
            setNotes([]);
            showToast('All notes deleted.', 'info');
        } catch {
            showToast('Failed to delete notes.', 'error');
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
                    <h1>📚 Notes Library</h1>
                    <p className="header-subtitle">
                        Share and access academic notes across semesters and subjects
                    </p>
                </div>
                <div className="header-actions">
                    <button
                        className="add-btn"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? '✕ Cancel' : '+ Upload Note'}
                    </button>
                    {notes.length > 0 && (
                        <button
                            className="action-btn delete-btn"
                            onClick={handleDeleteAll}
                        >
                            🗑 Delete All
                        </button>
                    )}
                </div>
            </header>

            {/* Upload Form */}
            {showForm && (
                <NoteForm
                    onSubmit={handleUpload}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {/* Filters */}
            <NoteFilterBar
                selectedSubject={selectedSubject}
                onSubjectChange={setSelectedSubject}
                selectedSemester={selectedSemester}
                onSemesterChange={setSelectedSemester}
                selectedSort={selectedSort}
                onSortChange={setSelectedSort}
            />

            {/* Error */}
            {error && (
                <div className="error-banner">
                    <span>⚠️ {error}</span>
                    <button className="retry-btn" onClick={fetchNotes}>Retry</button>
                </div>
            )}

            {/* Content */}
            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading notes...</p>
                </div>
            ) : !error && notes.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">📭</span>
                    <p>No notes uploaded yet.</p>
                    <button className="add-btn" onClick={() => setShowForm(true)}>
                        + Upload the first note
                    </button>
                </div>
            ) : (
                <div className="items-grid">
                    {notes.map((note) => (
                        <NoteCard key={note._id} note={note} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Notes;
