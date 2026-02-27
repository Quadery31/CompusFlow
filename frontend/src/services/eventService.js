import API from '../api';

/**
 * Fetch all events, optionally filtered.
 * @param {'all'|'upcoming'|'past'} filter
 * @param {string} [category]
 */
export const getEvents = async (filter = 'all', category = '') => {
    const params = {};
    if (filter === 'upcoming') params.upcoming = 'true';
    if (filter === 'past') params.upcoming = 'false';
    if (category) params.category = category;
    const { data } = await API.get('/events', { params });
    return data.data;
};

/**
 * Create a new event.
 * @param {Object} eventData
 */
export const createEvent = async (eventData) => {
    const { data } = await API.post('/events', eventData);
    return data.data;
};

/**
 * Delete an event.
 * @param {string} id
 */
export const deleteEvent = async (id) => {
    await API.delete(`/events/${id}`);
};
