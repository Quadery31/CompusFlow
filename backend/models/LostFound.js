import mongoose from 'mongoose';

const lostFoundSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title for the item']
    },
    description: {
        type: String
    },
    imageUrl: {
        type: String
    },
    type: {
        type: String,
        enum: ['lost', 'found'],
        required: [true, 'Please specify if the item is "lost" or "found"']
    },
    location: {
        type: String
    },
    contactInfo: {
        type: String,
        required: [true, 'Please provide contact information']
    },
    status: {
        type: String,
        enum: ['open', 'resolved'],
        default: 'open'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const LostFound = mongoose.model('LostFound', lostFoundSchema);

export default LostFound;
