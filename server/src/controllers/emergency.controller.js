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

    const hospitals = await Hospital.find({ pinCode: pincode });

    const localFileUrl = `/uploads/emergencies/${req.file.filename}`;

    const emergency = await Emergency.create({
        user: userId,
        type: 'emergency',
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

    let responseMessage = '';
    let responseData = {
        emergencyId: emergency._id,
        type: 'emergency',
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

const callAmbulance = asyncHandler(async (req, res) => {
    const { pincode, latitude, longitude, location, city, state } = req.body;
    const userId = req.userId;

    console.log('Received ambulance request:', { pincode, latitude, longitude, city, state });

    // Validate required fields
    if (!pincode || !latitude || !longitude) {
        throw new ApiError(statusCode.BAD_REQUEST, 'Missing required location details');
    }

    if (!location) {
        throw new ApiError(statusCode.BAD_REQUEST, 'Location address is required');
    }

    // Find all hospitals in the area
    const hospitals = await Hospital.find({ pinCode: pincode });

    // Create ambulance request record
    const ambulanceRequest = await Emergency.create({
        user: userId,
        type: 'ambulance',
        hospitalsNotified: hospitals.map((h) => h._id),
        pinCode: pincode,
        location: {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            address: location,
            city: city || 'Unknown',
            state: state || 'Unknown',
        },
        timestamp: new Date(),
        status: 'pending',
    });

    console.log('Ambulance request created:', ambulanceRequest._id);

    // Prepare response
    let responseMessage = '';
    let responseData = {
        requestId: ambulanceRequest._id,
        type: 'ambulance',
        hospitalsCount: hospitals.length,
        location: {
            pinCode: pincode,
            coordinates: {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude)
            },
            address: location,
            city: city || 'Unknown',
            state: state || 'Unknown',
        },
        timestamp: ambulanceRequest.timestamp,
    };

    if (!hospitals.length) {
        responseMessage = `Ambulance request registered. Warning: No hospitals found in pincode ${pincode}. Request has been forwarded to central emergency services.`;
        responseData.warning = `No hospitals found in pincode: ${pincode}`;
        responseData.hospitalsNotified = false;
    } else {
        responseMessage = `Ambulance request sent to ${hospitals.length} nearby hospital(s). Help is on the way!`;
        responseData.hospitalsNotified = true;
        responseData.hospitals = hospitals.map(h => ({
            id: h._id,
            name: h.name,
            contact: h.contact,
            address: h.address
        }));

        // TODO: Send real-time notifications to hospitals
        // await notifyHospitalsForAmbulance(hospitals, ambulanceRequest);
        // This could include:
        // - WebSocket notifications
        // - SMS alerts
        // - Push notifications to hospital staff app
        // - Email notifications
    }

    return res.status(statusCode.CREATED).json(
        new ApiResponse(
            statusCode.CREATED,
            responseMessage,
            responseData
        )
    );
});

export { createEmergencyAlert, callAmbulance, upload };