import Classroom from '../models/Classroom.js';

// @desc    Seed a classroom
// @route   POST /api/classrooms
// @access  Public (for seeding)
export const createClassroom = async (req, res) => {
    try {
        const { roomNumber, building, capacity, occupiedSlots } = req.body;

        // Check if room already exists
        const existingClassroom = await Classroom.findOne({ roomNumber });
        if (existingClassroom) {
            return res.status(400).json({ success: false, message: 'Classroom already exists' });
        }

        const classroom = await Classroom.create({
            roomNumber,
            building,
            capacity,
            occupiedSlots: occupiedSlots || [],
        });

        res.status(201).json({ success: true, data: classroom });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
};

// @desc    Get all classrooms
// @route   GET /api/classrooms
// @access  Public
export const getAllClassrooms = async (req, res) => {
    try {
        const classrooms = await Classroom.find({});
        res.status(200).json({ success: true, data: classrooms });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
};

// @desc    Get available classrooms for a specific day and time slot
// @route   GET /api/classrooms/available
// @access  Public
export const getAvailableClassrooms = async (req, res) => {
    try {
        const { day, startTime, endTime } = req.query;

        // 1. Validate inputs
        if (!day || !startTime || !endTime) {
            return res.status(400).json({ success: false, message: 'Missing required parameters: day, startTime, endTime are required' });
        }

        // Basic time format validation (HH:MM)
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
            return res.status(400).json({ success: false, message: 'Invalid time format. Please use HH:MM format' });
        }

        if (startTime >= endTime) {
            return res.status(400).json({ success: false, message: 'Invalid time range. startTime must be less than endTime' });
        }

        // 2. Fetch all classrooms
        const allClassrooms = await Classroom.find({});

        // 3. Filter available classrooms
        const availableClassrooms = allClassrooms.filter((classroom) => {
            // Get slots for the specified day
            const dailySlots = classroom.occupiedSlots.filter(
                (slot) => slot.day.toLowerCase() === day.toLowerCase()
            );

            // Check for overlapping slots
            // Overlap occurs if requestedStart < existingEnd AND requestedEnd > existingStart
            const hasOverlap = dailySlots.some((slot) => {
                return startTime < slot.endTime && endTime > slot.startTime;
            });

            // If no overlap, the room is available
            return !hasOverlap;
        });

        res.status(200).json({ success: true, data: availableClassrooms });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
};
