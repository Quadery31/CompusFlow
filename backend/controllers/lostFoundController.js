import LostFound from '../models/LostFound.js';

// @desc    Create a new lost/found item
// @route   POST /api/lost
// @access  Public
export const createItem = async (req, res) => {
    try {
        const { title, description, imageUrl, type, location, contactInfo, status } = req.body;

        if (!title || !type || !contactInfo) {
            return res.status(400).json({ success: false, message: 'Title, type, and contact info are required' });
        }

        if (!['lost', 'found'].includes(type)) {
            return res.status(400).json({ success: false, message: 'Type must be "lost" or "found"' });
        }

        const item = await LostFound.create({
            title,
            description,
            imageUrl,
            type,
            location,
            contactInfo,
            status: status || 'open'
        });

        res.status(201).json({
            success: true,
            data: item
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Get all items (with optional filtering by type)
// @route   GET /api/lost
// @access  Public
export const getItems = async (req, res) => {
    try {
        const { type } = req.query;
        let query = {};

        if (type && ['lost', 'found'].includes(type)) {
            query.type = type;
        }

        const items = await LostFound.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: items.length,
            data: items
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Update item
// @route   PUT /api/lost/:id
// @access  Public
export const updateItem = async (req, res) => {
    try {
        const item = await LostFound.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        const updatedItem = await LostFound.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: updatedItem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Delete item
// @route   DELETE /api/lost/:id
// @access  Public
export const deleteItem = async (req, res) => {
    try {
        const item = await LostFound.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        await item.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Item deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};
