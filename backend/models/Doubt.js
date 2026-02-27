import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Answer text is required']
    },
    upvotes: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const doubtSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title for the doubt']
    },
    description: {
        type: String,
        required: [true, 'Please add a description for the doubt']
    },
    subject: {
        type: String,
        required: [true, 'Please add a subject for the doubt']
    },
    status: {
        type: String,
        enum: ['open', 'solved'],
        default: 'open'
    },
    answers: [answerSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Doubt = mongoose.model('Doubt', doubtSchema);

export default Doubt;
