import {ApiError, ApiResponse, asyncHandler} from '../../utility/index.js';
import statusCode from '../../constants/statusCode.js';
import BloodDonation from '../../models/bloodDonation.model.js';
import BloodReceiver from '../../models/bloodReceiver.model.js';
import Hospital from '../../models/hospital.model.js';
import User from '../../models/user.model.js';
import Emergency from '../../models/emergency.model.js';


const addBloodDonation = asyncHandler(async (req, res) => {
    const {donorId, quantity} = req.body;

    if (!donorId || !quantity) {
        throw new ApiError(statusCode.BAD_REQUEST, 'All fields are required!');
    }

    const hospitalId = req.userId; // Authenticated hospital ID
    if (!hospitalId) {
        throw new ApiError(
            statusCode.UNAUTHORIZED,
            'Hospital not authenticated!'
        );
    }

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
        throw new ApiError(statusCode.NOT_FOUND, 'Hospital not found!');
    }

    const donor = await User.findById(donorId);
    if (!donor) {
        throw new ApiError(statusCode.NOT_FOUND, 'Donor not found!');
    }

    const donation = await BloodDonation.create({
        donor: donorId,
        hospital: hospitalId,
        bloodType: donor.bloodType,
        quantity,
        donationDate: new Date(),
    });

    const bloodType = donor.bloodType;

    hospital.bloodInventory[bloodType] =
        (hospital.bloodInventory[bloodType] || 0) + Number(quantity);

    await hospital.save();

    return res.status(statusCode.CREATED).json(
        new ApiResponse(
            statusCode.CREATED,
            'Blood donation recorded successfully and inventory updated.',
            {
                donationId: donation._id,
                donor: donor.name,
                hospital: hospital.name,
                bloodType,
                quantity,
                updatedStock: hospital.bloodInventory[bloodType],
                donationDate: donation.donationDate,
            }
        )
    );
});

const giveBloodDonation = asyncHandler(async (req, res) => {
    const {receiverId, quantity} = req.body;

    if (!receiverId || !quantity) {
        throw new ApiError(statusCode.BAD_REQUEST, 'All fields are required!');
    }

    const hospitalId = req.userId;
    if (!hospitalId) {
        throw new ApiError(
            statusCode.UNAUTHORIZED,
            'Hospital not authenticated!'
        );
    }

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
        throw new ApiError(statusCode.NOT_FOUND, 'Hospital not found!');
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
        throw new ApiError(statusCode.NOT_FOUND, 'Receiver not found!');
    }

    const bloodType = receiver.bloodType;
    const availableStock = hospital.bloodInventory[bloodType] || 0;

    if (availableStock < quantity) {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            `Not enough ${bloodType} blood available. Current stock: ${availableStock}`
        );
    }

    const bloodGiven = await BloodReceiver.create({
        receiver: receiverId,
        hospital: hospitalId,
        bloodType,
        quantity,
        receiveDate: new Date(),
    });

    hospital.bloodInventory[bloodType] = availableStock - Number(quantity);
    await hospital.save();

    return res.status(statusCode.CREATED).json(
        new ApiResponse(
            statusCode.CREATED,
            'Blood given successfully and inventory updated.',
            {
                recordId: bloodGiven._id,
                receiver: receiver.name,
                hospital: hospital.name,
                bloodType,
                quantity,
                updatedStock: hospital.bloodInventory[bloodType],
                receiveDate: bloodGiven.receiveDate,
            }
        )
    );
});

const getEmergenciesByHospital = asyncHandler(async (req, res) => {
    const hospitalId = req.userId;

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
        throw new ApiError(statusCode.NOT_FOUND, 'Hospital not found');
    }

    const emergencies = await Emergency.find({
        pinCode: hospital?.pinCode,
    })
        .sort({ createdAt: -1 })
        .populate('user', 'name phoneNumber bloodType')
        .lean();

    return res.status(statusCode.OK).json(
        new ApiResponse(
            statusCode.OK,
            `Fetched ${emergencies.length} emergencies for pinCode ${hospital.pinCode}`,
            emergencies
        )
    );
});

const getEmergencyById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const hospitalId = req.userId;

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
        throw new ApiError(statusCode.NOT_FOUND, 'Hospital not found');
    }

    const emergency = await Emergency.findById(id)
        .populate('user', 'name phoneNumber bloodType')
        .lean();

    if (!emergency) {
        throw new ApiError(statusCode.NOT_FOUND, 'Emergency not found');
    }

    if (emergency.pinCode !== hospital.pinCode) {
        throw new ApiError(statusCode.FORBIDDEN, 'Access denied for this emergency');
    }

    return res
        .status(statusCode.OK)
        .json(
            new ApiResponse(
                statusCode.OK,
                'Fetched emergency details successfully',
                emergency
            )
        );
});

export {addBloodDonation, giveBloodDonation, getEmergenciesByHospital, getEmergencyById};
