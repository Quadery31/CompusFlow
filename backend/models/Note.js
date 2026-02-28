import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Comment text is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    description: {
        type: String
    },
    subject: {
        type: String,
        required: [true, 'Please add a subject']
    },
    semester: {
        type: Number,
        required: [true, 'Please add a semester']
    },
    fileUrl: {
        type: String,
        required: [true, 'File URL is required']
    },
    fileName: {
        type: String
    },
    uploadedBy: {
        type: String
    },
    upvotes: {
        type: Number,
        default: 0
    },
    comments: [commentSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Note = mongoose.model('Note', noteSchema);

export default Note;
