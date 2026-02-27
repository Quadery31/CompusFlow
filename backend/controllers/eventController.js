import Event from '../models/Event.js';

// @desc    Create a new event
// @route   POST /api/events
// @access  Public
export const createEvent = async (req, res) => {
    try {
        const { title, description, date, time, venue, organizer, registrationLink, category } = req.body;

        if (!title || !date) {
            return res.status(400).json({ success: false, message: 'Title and date are required' });
        }

        const event = await Event.create({
            title,
            description,
            date,
            time,
            venue,
            organizer,
            registrationLink,
            category
        });

        res.status(201).json({
            success: true,
            data: event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Get all events (with optional filtering)
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res) => {
    try {
        const { category, upcoming } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }

        if (upcoming === 'true') {
            query.date = { $gte: new Date() };
        } else if (upcoming === 'false') {
            query.date = { $lt: new Date() };
        }

        const events = await Event.find(query).sort({ date: 1 });

        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Public
export const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: updatedEvent
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Public
export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        await event.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};
