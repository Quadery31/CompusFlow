import multer from 'multer';
import path from 'path';

// Configure disk storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

// Accept only PDF files
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
});

// Wrapper middleware that catches Multer errors and returns structured JSON
const uploadMiddleware = (req, res, next) => {
    const singleUpload = upload.single('file');

    singleUpload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Multer-specific errors (e.g. file too large)
            return res.status(400).json({
                success: false,
                message: err.code === 'LIMIT_FILE_SIZE'
                    ? 'File too large. Maximum size is 5MB'
                    : err.message
            });
        } else if (err) {
            // Custom errors (e.g. wrong file type)
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        next();
    });
};

export default uploadMiddleware;
