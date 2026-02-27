import Complaint from '../models/Complaint.js';

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Public
export const createComplaint = async (req, res) => {
    try {
        const { title, description, category, isAnonymous, displayName } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({
                success: false,
                message: 'Title, description, and category are required'
            });
        }

        // If not anonymous, displayName is required
        if (isAnonymous === false && !displayName) {
            return res.status(400).json({
                success: false,
                message: 'Display name is required when not posting anonymously'
            });
        }

        const complaintData = {
            title,
            description,
            category,
            isAnonymous: isAnonymous !== false, // default true
        };

        // Only include displayName if not anonymous
        if (isAnonymous === false) {
            complaintData.displayName = displayName;
        }

        const complaint = await Complaint.create(complaintData);

        res.status(201).json({
            success: true,
            data: complaint
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Get all complaints (with optional filtering & sorting)
// @route   GET /api/complaints
// @access  Public
export const getComplaints = async (req, res) => {
    try {
        const { category, sort } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }

        let complaints;

        if (sort === 'upvotes') {
            complaints = await Complaint.find(query).sort({ upvotes: -1 });
        } else {
            // Default: latest first
            complaints = await Complaint.find(query).sort({ createdAt: -1 });
        }

        res.status(200).json({
            success: true,
            count: complaints.length,
            data: complaints
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Get single complaint by ID
// @route   GET /api/complaints/:id
// @access  Public
export const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }

        res.status(200).json({
            success: true,
            data: complaint
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Upvote a complaint
// @route   PUT /api/complaints/:id/upvote
// @access  Public
export const upvoteComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }

        complaint.upvotes += 1;
        await complaint.save();

        res.status(200).json({
            success: true,
            data: complaint
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Add a comment to a complaint
// @route   POST /api/complaints/:id/comments
// @access  Public
export const addComment = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                success: false,
                message: 'Comment text is required'
            });
        }

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }

        complaint.comments.push({ text });
        await complaint.save();

        res.status(200).json({
            success: true,
            data: complaint
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Update complaint status (community tagging)
// @route   PUT /api/complaints/:id/status
// @access  Public
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const validStatuses = ['open', 'discussion', 'escalated', 'resolved'];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Status must be one of: ${validStatuses.join(', ')}`
            });
        }

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }

        complaint.status = status;
        await complaint.save();

        res.status(200).json({
            success: true,
            data: complaint
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Delete a complaint
// @route   DELETE /api/complaints/:id
// @access  Public
export const deleteComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }

        await complaint.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Complaint deleted successfully'
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Delete all complaints
// @route   DELETE /api/complaints
// @access  Public
export const deleteAllComplaints = async (req, res) => {
    try {
        await Complaint.deleteMany({});

        res.status(200).json({
            success: true,
            message: 'All complaints deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};
