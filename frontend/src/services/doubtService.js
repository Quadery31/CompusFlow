import API from '../api';

/**
 * Fetch all doubts, optionally filtered and sorted.
 * @param {string} [subject] - Filter by subject
 * @param {string} [sort] - Sort by: 'latest' | 'answers' | 'upvotes'
 */
export const getDoubts = async (subject = '', sort = '') => {
    const params = {};
    if (subject) params.subject = subject;
    if (sort) params.sort = sort;
    const { data } = await API.get('/doubts', { params });
    return data.data;
};

/**
 * Fetch a single doubt by ID.
 * @param {string} id
 */
export const getDoubtById = async (id) => {
    const { data } = await API.get(`/doubts/${id}`);
    return data.data;
};

/**
 * Create a new doubt.
 * @param {Object} doubtData - { title, description, subject }
 */
export const createDoubt = async (doubtData) => {
    const { data } = await API.post('/doubts', doubtData);
    return data.data;
};

/**
 * Add an answer to a doubt.
 * @param {string} doubtId
 * @param {string} text
 */
export const addAnswer = async (doubtId, text) => {
    const { data } = await API.post(`/doubts/${doubtId}/answers`, { text });
    return data.data;
};

/**
 * Upvote an answer.
 * @param {string} doubtId
 * @param {string} answerId
 */
export const upvoteAnswer = async (doubtId, answerId) => {
    const { data } = await API.put(`/doubts/${doubtId}/answers/${answerId}/upvote`);
    return data.data;
};

/**
 * Mark a doubt as solved.
 * @param {string} id
 */
export const markDoubtSolved = async (id) => {
    const { data } = await API.put(`/doubts/${id}/solve`);
    return data.data;
};

/**
 * Delete a single doubt.
 * @param {string} id
 */
export const deleteDoubt = async (id) => {
    await API.delete(`/doubts/${id}`);
};

/**
 * Delete all doubts.
 */
export const deleteAllDoubts = async () => {
    await API.delete('/doubts');
};

