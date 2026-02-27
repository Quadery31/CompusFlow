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

const complaintSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title for the complaint']
    },
    description: {
        type: String,
        required: [true, 'Please add a description for the complaint']
    },
    category: {
        type: String,
        required: [true, 'Please add a category for the complaint']
    },
    isAnonymous: {
        type: Boolean,
        default: true
    },
    displayName: {
        type: String
    },
    status: {
        type: String,
        enum: ['open', 'discussion', 'escalated', 'resolved'],
        default: 'open'
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

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
