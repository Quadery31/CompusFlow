import { useState } from 'react';

const SUBJECTS = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Electrical',
    'Biology',
    'English',
    'Economics',
    'Other',
];

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

function NoteForm({ onSubmit, onCancel }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [subject, setSubject] = useState('');
    const [semester, setSemester] = useState('');
    const [uploadedBy, setUploadedBy] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type !== 'application/pdf') {
            setFormError('Only PDF files are allowed.');
            setSelectedFile(null);
            e.target.value = '';
            return;
        }
        if (file && file.size > 5 * 1024 * 1024) {
            setFormError('File too large. Maximum size is 5MB.');
            setSelectedFile(null);
            e.target.value = '';
            return;
        }
        setFormError('');
        setSelectedFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!title.trim()) {
            setFormError('Title is required.');
            return;
        }
        if (!subject) {
            setFormError('Please select a subject.');
            return;
        }
        if (!semester) {
            setFormError('Please select a semester.');
            return;
        }
        if (!selectedFile) {
            setFormError('Please select a PDF file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('description', description.trim());
        formData.append('subject', subject);
        formData.append('semester', semester);
        formData.append('uploadedBy', uploadedBy.trim());
        formData.append('file', selectedFile);

        setSubmitting(true);
        try {
            await onSubmit(formData);
            // Reset form
            setTitle('');
            setDescription('');
            setSubject('');
            setSemester('');
            setUploadedBy('');
            setSelectedFile(null);
        } catch (err) {
            setFormError(err?.response?.data?.message || 'Upload failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="item-form-wrapper">
            <form className="item-form" onSubmit={handleSubmit}>
                <div className="form-header-row">
                    <h2>📤 Upload Note</h2>
                    <button type="button" className="form-close-btn" onClick={onCancel}>
                        ✕
                    </button>
                </div>

                {formError && <div className="form-error">{formError}</div>}

                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="note-title">Title *</label>
                        <input
                            id="note-title"
                            type="text"
                            placeholder="e.g. Data Structures Unit 3 Notes"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="note-uploader">Uploaded By</label>
                        <input
                            id="note-uploader"
                            type="text"
                            placeholder="Your name (optional)"
                            value={uploadedBy}
                            onChange={(e) => setUploadedBy(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="note-subject">Subject *</label>
                        <select
                            id="note-subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        >
                            <option value="">Select Subject</option>
                            {SUBJECTS.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="note-semester">Semester *</label>
                        <select
                            id="note-semester"
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                        >
                            <option value="">Select Semester</option>
                            {SEMESTERS.map((sem) => (
                                <option key={sem} value={sem}>Semester {sem}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="note-description">Description</label>
                        <textarea
                            id="note-description"
                            placeholder="Brief description of the notes content..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="form-group full-width">
                        <label htmlFor="note-file">PDF File * (max 5MB)</label>
                        <div className="file-input-wrapper">
                            <input
                                id="note-file"
                                type="file"
                                accept=".pdf,application/pdf"
                                onChange={handleFileChange}
                            />
                            {selectedFile && (
                                <span className="file-name-display">
                                    📄 {selectedFile.name}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={submitting}
                >
                    {submitting ? (
                        <>
                            <span className="btn-spinner"></span> Uploading...
                        </>
                    ) : (
                        '📤 Upload Note'
                    )}
                </button>
            </form>
        </div>
    );
}

export default NoteForm;
