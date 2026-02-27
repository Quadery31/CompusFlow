import API from '../api';

/**
 * Fetch all complaints, optionally filtered and sorted.
 * @param {string} [category]
 * @param {string} [sort] - 'latest' | 'upvotes'
 */
export const getComplaints = async (category = '', sort = '') => {
    const params = {};
    if (category) params.category = category;
    if (sort) params.sort = sort;
    const { data } = await API.get('/complaints', { params });
    return data.data;
};

/**
 * Fetch a single complaint by ID.
 */
export const getComplaintById = async (id) => {
    const { data } = await API.get(`/complaints/${id}`);
    return data.data;
};

/**
 * Create a new complaint.
 */
export const createComplaint = async (complaintData) => {
    const { data } = await API.post('/complaints', complaintData);
    return data.data;
};

/**
 * Upvote a complaint.
 */
export const upvoteComplaint = async (id) => {
    const { data } = await API.put(`/complaints/${id}/upvote`);
    return data.data;
};

/**
 * Add a comment to a complaint.
 */
export const addComment = async (complaintId, text) => {
    const { data } = await API.post(`/complaints/${complaintId}/comments`, { text });
    return data.data;
};

/**
 * Update complaint status.
 * @param {string} status - 'open' | 'discussion' | 'escalated' | 'resolved'
 */
export const updateComplaintStatus = async (id, status) => {
    const { data } = await API.put(`/complaints/${id}/status`, { status });
    return data.data;
};

/**
 * Delete a single complaint.
 */
export const deleteComplaint = async (id) => {
    await API.delete(`/complaints/${id}`);
};

/**
 * Delete all complaints.
 */
export const deleteAllComplaints = async () => {
    await API.delete('/complaints');
};
