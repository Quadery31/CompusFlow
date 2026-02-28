import API from '../api';

/**
 * Fetch all notes, optionally filtered and sorted.
 * @param {string} [subject]
 * @param {string} [semester]
 * @param {string} [sort] - 'latest' | 'upvotes'
 */
export const getNotes = async (subject = '', semester = '', sort = '') => {
    const params = {};
    if (subject) params.subject = subject;
    if (semester) params.semester = semester;
    if (sort === 'upvotes') params.sort = 'upvotes';
    const { data } = await API.get('/notes', { params });
    return data.data;
};

/**
 * Fetch a single note by ID.
 */
export const getNoteById = async (id) => {
    const { data } = await API.get(`/notes/${id}`);
    return data.data;
};

/**
 * Upload a new note. Expects a FormData instance with:
 *   - title, description, subject, semester, uploadedBy, file
 */
export const uploadNote = async (formData) => {
    const { data } = await API.post('/notes', formData);
    return data.data;
};

/**
 * Upvote a note.
 */
export const upvoteNote = async (id) => {
    const { data } = await API.put(`/notes/${id}/upvote`);
    return data.data;
};

/**
 * Add a comment to a note.
 */
export const addNoteComment = async (noteId, text) => {
    const { data } = await API.post(`/notes/${noteId}/comments`, { text });
    return data.data;
};

/**
 * Delete a single note.
 */
export const deleteNote = async (id) => {
    await API.delete(`/notes/${id}`);
};

/**
 * Delete all notes.
 */
export const deleteAllNotes = async () => {
    await API.delete('/notes');
};

/**
 * Delete a single comment from a note.
 */
export const deleteNoteComment = async (noteId, commentId) => {
    const { data } = await API.delete(`/notes/${noteId}/comments/${commentId}`);
    return data.data;
};

/**
 * Delete all comments from a note.
 */
export const deleteAllNoteComments = async (noteId) => {
    const { data } = await API.delete(`/notes/${noteId}/comments`);
    return data.data;
};
