import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
    day: {
        type: String,
        required: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    }
});

const classroomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true,
        unique: true,
    },
    building: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
    },
    occupiedSlots: [slotSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Classroom = mongoose.model('Classroom', classroomSchema);

export default Classroom;
