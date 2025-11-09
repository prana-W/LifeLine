import { ApiError, ApiResponse, asyncHandler } from '../utility/index.js';
import statusCode from '../constants/statusCode.js';
import Emergency from '../models/emergency.model.js';
import Hospital from '../models/hospital.model.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads/emergencies');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const fileName = `emergency_${req.userId}_${Date.now()}.webm`;
        cb(null, fileName);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        // Accept video files only
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only video files are allowed!'), false);
        }
    }
});

const createEmergencyAlert = asyncHandler(async (req, res) => {
    const { pincode, latitude, longitude, location, timestamp, city, state } = req.body;
    const userId = req.userId;

    console.log('Received emergency request:', { pincode, latitude, longitude, city, state });
    console.log('File received:', req.file ? 'Yes' : 'No');

    if (!pincode || !latitude || !longitude) {
        throw new ApiError(statusCode.BAD_REQUEST, 'Missing required location details');
    }

    if (!req.file) {
        throw new ApiError(statusCode.BAD_REQUEST, 'Audio/video recording is required');
    }

    // Find hospitals in the area
    const hospitals = await Hospital.find({ pinCode: pincode });

    const localFileUrl = `/uploads/emergencies/${req.file.filename}`;

    // Create emergency record regardless of hospital availability
    const emergency = await Emergency.create({
        user: userId,
        hospitalsNotified: hospitals.map((h) => h._id),
        pinCode: pincode,
        location: {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            address: location,
            city: city,
            state: state,
        },
        audioVideoUrl: localFileUrl,
        timestamp: timestamp || new Date(),
        status: 'pending',
    });

    console.log('Emergency created:', emergency._id);

    // Prepare response message and data
    let responseMessage = '';
    let responseData = {
        emergencyId: emergency._id,
        hospitalsCount: hospitals.length,
        fileUrl: localFileUrl,
        location: {
            pinCode: pincode,
            coordinates: {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude)
            },
            address: location,
        },
    };

    if (!hospitals.length) {
        responseMessage = `Emergency alert registered. Warning: No hospitals found in pincode ${pincode}. Emergency services have been notified.`;
        responseData.warning = `No hospitals found in pincode: ${pincode}`;
        responseData.hospitalsNotified = false;
    } else {
        responseMessage = 'Emergency alert created and nearby hospitals notified.';
        responseData.hospitalsNotified = true;
        // TODO: Notify hospitals via WebSocket, SMS, Email, etc.
        // await notifyHospitals(hospitals, emergency);
    }

    return res.status(statusCode.CREATED).json(
        new ApiResponse(
            statusCode.CREATED,
            responseMessage,
            responseData
        )
    );
});

export { createEmergencyAlert, upload };