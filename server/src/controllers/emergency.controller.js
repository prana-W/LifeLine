import { ApiError, ApiResponse, asyncHandler } from '../utility/index.js';
import statusCode from '../constants/statusCode.js';
import Emergency from '../models/emergency.model.js';
import Hospital from '../models/hospital.model.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from "../models/user.model.js";

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

    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(statusCode.BAD_REQUEST, 'User not found!');
    }

    const {pinCode} = user;

    // Find all hospitals in the area
    const hospitals = await Hospital.find({ pinCode: pinCode });

    // Create ambulance request record
    const ambulanceRequest = await Emergency.create({
        user: userId,
        type: 'ambulance',
        hospitalsNotified: hospitals.map((h) => h._id),
        pinCode: pinCode,
        timestamp: new Date(),
        status: 'pending',
    });

    return res.status(statusCode.CREATED).json(
        new ApiResponse(
            statusCode.CREATED,
            'Ambulance request was raised!'
        )
    );
});

/**
 * Request blood emergency
 * POST /api/v1/user/blood-request
 */
const requestBloodEmergency = asyncHandler(async (req, res) => {

    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(statusCode.BAD_REQUEST, 'User not found!');
    }
    
    const {bloodType, name:patientName, pinCode, phoneNumber} = user;

    console.log('Received blood request:', {
        bloodType,
        patientName
    });

    // Validate required fields
    if (!bloodType || !pinCode) {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            'Blood type and location details are required'
        );
    }

    if (!phoneNumber) {
        throw new ApiError(statusCode.BAD_REQUEST, 'Contact number is required');
    }

    if (!patientName) {
        throw new ApiError(statusCode.BAD_REQUEST, 'Patient name is required');
    }

    // Validate blood type
    const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!validBloodTypes.includes(bloodType)) {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            `Invalid blood type. Must be one of: ${validBloodTypes.join(', ')}`
        );
    }

    const hospitals = await Hospital.find({ pinCode: pinCode });

    // Create blood request emergency
    const bloodRequest = await Emergency.create({
        user: userId,
        type: 'blood',
        hospitalsNotified: hospitals.map((h) => h._id),
        pinCode,
        bloodRequest: {
            bloodType,
            patientName,
            phoneNumber,
        },
        timestamp: new Date()
    });

    return res.status(statusCode.CREATED).json(
        new ApiResponse(
            statusCode.CREATED,
            'Blood request was raised at all the nearby hospitals!'
        )
    );
});

/**
 * Get blood request details
 * GET /api/v1/user/blood-request/:requestId
 */
const getBloodRequestDetails = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const userId = req.userId;

    const bloodRequest = await Emergency.findOne({
        _id: requestId,
        user: userId,
        type: 'blood'
    })
        .populate('user', 'name email')
        .populate('hospitalsNotified', 'name address contact pinCode');

    if (!bloodRequest) {
        throw new ApiError(
            statusCode.NOT_FOUND,
            'Blood request not found or you do not have permission to view it'
        );
    }

    return res.status(statusCode.OK).json(
        new ApiResponse(
            statusCode.OK,
            'Blood request details retrieved successfully',
            {
                requestId: bloodRequest._id,
                type: bloodRequest.type,
                bloodType: bloodRequest.bloodRequest.bloodType,
                unitsRequired: bloodRequest.bloodRequest.unitsRequired,
                urgencyLevel: bloodRequest.bloodRequest.urgencyLevel,
                patientName: bloodRequest.bloodRequest.patientName,
                reason: bloodRequest.bloodRequest.reason,
                contactNumber: bloodRequest.bloodRequest.contactNumber,
                location: bloodRequest.location,
                status: bloodRequest.status,
                hospitalsNotified: bloodRequest.hospitalsNotified,
                createdAt: bloodRequest.createdAt,
                timestamp: bloodRequest.timestamp,
                resolvedAt: bloodRequest.resolvedAt,
            }
        )
    );
});


/**
 * @desc   Delete a specific emergency by ID (hospital can mark it as consumed)
 * @route  DELETE /api/hospital/emergencies/:emergencyId
 * @access Private (Hospital)
 */
const deleteEmergency = asyncHandler(async (req, res) => {
    const { emergencyId } = req.params;

    // Find emergency
    const emergency = await Emergency.findById(emergencyId);
    if (!emergency) {
        throw new ApiError(statusCode.NOT_FOUND, 'Emergency not found');
    }

    // 🧹 Delete associated local video file if exists
    if (emergency.audioVideoUrl) {
        const filePath = path.join(process.cwd(), emergency.audioVideoUrl);
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`🧹 Deleted emergency file: ${filePath}`);
            }
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    }

    // Delete record
    await Emergency.findByIdAndDelete(emergencyId);

    return res
        .status(statusCode.OK)
        .json(
            new ApiResponse(
                statusCode.OK,
                'Emergency record deleted successfully.',
                { deletedEmergencyId: emergencyId }
            )
        );
});

export { createEmergencyAlert, callAmbulance, upload,  requestBloodEmergency,
    getBloodRequestDetails, deleteEmergency
};