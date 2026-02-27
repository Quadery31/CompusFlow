import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title for the event']
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        required: [true, 'Please add a date for the event']
    },
    time: {
        type: String
    },
    venue: {
        type: String
    },
    organizer: {
        type: String
    },
    registrationLink: {
        type: String
    },
    category: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
