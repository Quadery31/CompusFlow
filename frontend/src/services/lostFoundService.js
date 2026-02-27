import API from '../api';

/**
 * Fetch all lost/found items, optionally filtered by type.
 * @param {'all'|'lost'|'found'} filter
 */
export const getItems = async (filter = 'all') => {
    const params = filter !== 'all' ? { type: filter } : {};
    const { data } = await API.get('/lost', { params });
    return data.data;
};

/**
 * Create a new lost/found item.
 * @param {Object} itemData
 */
export const createItem = async (itemData) => {
    const { data } = await API.post('/lost', itemData);
    return data.data;
};

/**
 * Mark an item as found (moves it to the "found" section).
 * @param {string} id
 */
export const markAsFound = async (id) => {
    const { data } = await API.put(`/lost/${id}`, { type: 'found', status: 'resolved' });
    return data.data;
};

/**
 * Delete an item.
 * @param {string} id
 */
export const deleteItem = async (id) => {
    await API.delete(`/lost/${id}`);
};
