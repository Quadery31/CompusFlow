import Doubt from '../models/Doubt.js';

// @desc    Create a new doubt
// @route   POST /api/doubts
// @access  Public
export const createDoubt = async (req, res) => {
    try {
        const { title, description, subject } = req.body;

        if (!title || !description || !subject) {
            return res.status(400).json({
                success: false,
                message: 'Title, description, and subject are required'
            });
        }

        const doubt = await Doubt.create({ title, description, subject });

        res.status(201).json({
            success: true,
            data: doubt
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Get all doubts (with optional filtering & sorting)
// @route   GET /api/doubts
// @access  Public
export const getDoubts = async (req, res) => {
    try {
        const { subject, sort } = req.query;
        let query = {};

        if (subject) {
            query.subject = subject;
        }

        let doubts;

        if (sort === 'upvotes') {
            // Fetch all matching doubts, compute total upvotes in JS, then sort
            doubts = await Doubt.find(query);
            doubts.sort((a, b) => {
                const totalA = a.answers.reduce((sum, ans) => sum + ans.upvotes, 0);
                const totalB = b.answers.reduce((sum, ans) => sum + ans.upvotes, 0);
                return totalB - totalA;
            });
        } else if (sort === 'answers') {
            doubts = await Doubt.find(query).sort({ 'answers': -1 });
            // Sort by answers array length in JS for accuracy
            doubts.sort((a, b) => b.answers.length - a.answers.length);
        } else {
            // Default: latest first
            doubts = await Doubt.find(query).sort({ createdAt: -1 });
        }

        res.status(200).json({
            success: true,
            count: doubts.length,
            data: doubts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Get single doubt by ID
// @route   GET /api/doubts/:id
// @access  Public
export const getDoubtById = async (req, res) => {
    try {
        const doubt = await Doubt.findById(req.params.id);

        if (!doubt) {
            return res.status(404).json({
                success: false,
                message: 'Doubt not found'
            });
        }

        res.status(200).json({
            success: true,
            data: doubt
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Doubt not found'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Add an answer to a doubt
// @route   POST /api/doubts/:id/answers
// @access  Public
export const addAnswer = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                success: false,
                message: 'Answer text is required'
            });
        }

        const doubt = await Doubt.findById(req.params.id);

        if (!doubt) {
            return res.status(404).json({
                success: false,
                message: 'Doubt not found'
            });
        }

        doubt.answers.push({ text });
        await doubt.save();

        res.status(200).json({
            success: true,
            data: doubt
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Doubt not found'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Upvote an answer
// @route   PUT /api/doubts/:id/answers/:answerId/upvote
// @access  Public
export const upvoteAnswer = async (req, res) => {
    try {
        const doubt = await Doubt.findById(req.params.id);

        if (!doubt) {
            return res.status(404).json({
                success: false,
                message: 'Doubt not found'
            });
        }

        const answer = doubt.answers.id(req.params.answerId);

        if (!answer) {
            return res.status(404).json({
                success: false,
                message: 'Answer not found'
            });
        }

        answer.upvotes += 1;
        await doubt.save();

        res.status(200).json({
            success: true,
            data: doubt
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Doubt not found'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Mark doubt as solved
// @route   PUT /api/doubts/:id/solve
// @access  Public
export const markSolved = async (req, res) => {
    try {
        const doubt = await Doubt.findById(req.params.id);

        if (!doubt) {
            return res.status(404).json({
                success: false,
                message: 'Doubt not found'
            });
        }

        doubt.status = 'solved';
        await doubt.save();

        res.status(200).json({
            success: true,
            data: doubt
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Doubt not found'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Delete a doubt
// @route   DELETE /api/doubts/:id
// @access  Public
export const deleteDoubt = async (req, res) => {
    try {
        const doubt = await Doubt.findById(req.params.id);

        if (!doubt) {
            return res.status(404).json({
                success: false,
                message: 'Doubt not found'
            });
        }

        await doubt.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Doubt deleted successfully'
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Doubt not found'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Delete all doubts
// @route   DELETE /api/doubts
// @access  Public
export const deleteAllDoubts = async (req, res) => {
    try {
        await Doubt.deleteMany({});

        res.status(200).json({
            success: true,
            message: 'All doubts deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

