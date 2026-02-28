import Note from '../models/Note.js';

// @desc    Upload a new note (with PDF file)
// @route   POST /api/notes
// @access  Public
export const uploadNote = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a PDF file'
            });
        }

        const { title, description, subject, semester, uploadedBy } = req.body;

        if (!title || !subject || !semester) {
            return res.status(400).json({
                success: false,
                message: 'Title, subject, and semester are required'
            });
        }

        const note = await Note.create({
            title,
            description,
            subject,
            semester: Number(semester),
            fileUrl: `uploads/${req.file.filename}`,
            fileName: req.file.originalname,
            uploadedBy
        });

        res.status(201).json({
            success: true,
            data: note
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Get all notes (with optional filtering & sorting)
// @route   GET /api/notes
// @access  Public
export const getNotes = async (req, res) => {
    try {
        const { subject, semester, sort } = req.query;
        let query = {};

        if (subject) {
            query.subject = subject;
        }

        if (semester) {
            query.semester = Number(semester);
        }

        let sortOption = { createdAt: -1 }; // default: newest first

        if (sort === 'upvotes') {
            sortOption = { upvotes: -1 };
        }

        const notes = await Note.find(query).sort(sortOption);

        res.status(200).json({
            success: true,
            count: notes.length,
            data: notes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Get single note by ID
// @route   GET /api/notes/:id
// @access  Public
export const getNoteById = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        res.status(200).json({
            success: true,
            data: note
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Upvote a note
// @route   PUT /api/notes/:id/upvote
// @access  Public
export const upvoteNote = async (req, res) => {
    try {
        const note = await Note.findByIdAndUpdate(
            req.params.id,
            { $inc: { upvotes: 1 } },
            { new: true }
        );

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        res.status(200).json({
            success: true,
            data: note
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Add a comment to a note
// @route   POST /api/notes/:id/comments
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

        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        note.comments.push({ text });
        await note.save();

        res.status(200).json({
            success: true,
            data: note
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Delete a single note
// @route   DELETE /api/notes/:id
// @access  Public
export const deleteNote = async (req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Note deleted successfully'
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Delete all notes
// @route   DELETE /api/notes
// @access  Public
export const deleteAllNotes = async (req, res) => {
    try {
        await Note.deleteMany({});
        res.status(200).json({
            success: true,
            message: 'All notes deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Delete a single comment from a note
// @route   DELETE /api/notes/:id/comments/:commentId
// @access  Public
export const deleteComment = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        const commentIndex = note.comments.findIndex(
            (c) => c._id.toString() === req.params.commentId
        );

        if (commentIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        note.comments.splice(commentIndex, 1);
        await note.save();

        res.status(200).json({
            success: true,
            data: note
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Delete all comments from a note
// @route   DELETE /api/notes/:id/comments
// @access  Public
export const deleteAllComments = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        note.comments = [];
        await note.save();

        res.status(200).json({
            success: true,
            data: note
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};
