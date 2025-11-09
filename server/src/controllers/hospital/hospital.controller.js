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

/**
 * Add organ to hospital inventory
 * POST /api/v1/hospital/organ-donation/add
 */
const addOrganToInventory = asyncHandler(async (req, res) => {
    const { donorId, organType, bloodType, consentType, contactNumber } = req.body;
    const hospitalId = req.hospitalId; // Assuming you have hospital auth middleware

    // Validate required fields
    if (!donorId || !organType || !bloodType || !consentType || !contactNumber) {
        throw new ApiError(statusCode.BAD_REQUEST, 'All fields are required');
    }

    // Verify hospital exists
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
        throw new ApiError(statusCode.NOT_FOUND, 'Hospital not found');
    }

    // Verify donor exists
    const donor = await User.findById(donorId);
    if (!donor) {
        throw new ApiError(statusCode.NOT_FOUND, 'Donor not found');
    }

    // Create organ donation record in hospital inventory
    const organDonation = await OrganDonation.create({
        donor: donorId,
        hospital: hospitalId,
        organType,
        bloodType,
        pinCode: hospital.pinCode,
        consentType,
        contactNumber,
        availability: 'Available',
    });

    await organDonation.populate('donor', 'name email');
    await organDonation.populate('hospital', 'name address contact');

    return res.status(statusCode.CREATED).json(
        new ApiResponse(
            statusCode.CREATED,
            'Organ added to hospital inventory successfully',
            {
                inventoryId: organDonation._id,
                organType: organDonation.organType,
                bloodType: organDonation.bloodType,
                donor: {
                    id: organDonation.donor._id,
                    name: organDonation.donor.name,
                },
                hospital: {
                    id: organDonation.hospital._id,
                    name: organDonation.hospital.name,
                },
                availability: organDonation.availability,
                registeredAt: organDonation.registeredAt,
            }
        )
    );
});

/**
 * Get hospital's organ inventory
 * GET /api/v1/hospital/organ-donation/inventory
 */
const getHospitalInventory = asyncHandler(async (req, res) => {
    const hospitalId = req.hospitalId;
    const { availability, organType, bloodType } = req.query;

    // Build query
    const query = { hospital: hospitalId };

    if (availability) {
        query.availability = availability;
    }

    if (organType) {
        query.organType = organType;
    }

    if (bloodType) {
        query.bloodType = bloodType;
    }

    const inventory = await OrganDonation.find(query)
        .populate('donor', 'name email contactNumber')
        .sort({ registeredAt: -1 });

    // Group by availability status
    const grouped = {
        available: inventory.filter(o => o.availability === 'Available'),
        reserved: inventory.filter(o => o.availability === 'Reserved'),
        donated: inventory.filter(o => o.availability === 'Donated'),
        expired: inventory.filter(o => o.availability === 'Expired'),
    };

    return res.status(statusCode.OK).json(
        new ApiResponse(
            statusCode.OK,
            'Hospital inventory retrieved successfully',
            {
                totalOrgans: inventory.length,
                summary: {
                    available: grouped.available.length,
                    reserved: grouped.reserved.length,
                    donated: grouped.donated.length,
                    expired: grouped.expired.length,
                },
                inventory: inventory.map(organ => ({
                    id: organ._id,
                    organType: organ.organType,
                    bloodType: organ.bloodType,
                    availability: organ.availability,
                    consentType: organ.consentType,
                    donor: {
                        id: organ.donor._id,
                        name: organ.donor.name,
                        contactNumber: organ.contactNumber,
                    },
                    registeredAt: organ.registeredAt,
                    updatedAt: organ.updatedAt,
                }))
            }
        )
    );
});

/**
 * Transfer organ to another user (complete donation)
 * POST /api/v1/hospital/organ-donation/transfer/:donationId
 */
const transferOrgan = asyncHandler(async (req, res) => {
    const { donationId } = req.params;
    const { recipientId, recipientName, recipientContact, notes } = req.body;
    const hospitalId = req.hospitalId;

    // Validate required fields
    if (!recipientId || !recipientName || !recipientContact) {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            'Recipient information is required'
        );
    }

    // Find the organ donation
    const organDonation = await OrganDonation.findOne({
        _id: donationId,
        hospital: hospitalId,
    }).populate('donor', 'name email');

    if (!organDonation) {
        throw new ApiError(
            statusCode.NOT_FOUND,
            'Organ not found in your hospital inventory'
        );
    }

    if (organDonation.availability === 'Donated') {
        throw new ApiError(
            statusCode.CONFLICT,
            'This organ has already been donated'
        );
    }

    if (organDonation.availability === 'Expired') {
        throw new ApiError(
            statusCode.CONFLICT,
            'This organ has expired and cannot be transferred'
        );
    }

    // Verify recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
        throw new ApiError(statusCode.NOT_FOUND, 'Recipient not found');
    }

    // Update organ donation status
    organDonation.availability = 'Donated';
    await organDonation.save();

    // TODO: Create a separate OrganTransfer model to track transfers
    // TODO: Send notifications to donor, recipient, and hospital
    // TODO: Generate transfer documentation

    return res.status(statusCode.OK).json(
        new ApiResponse(
            statusCode.OK,
            'Organ transferred successfully',
            {
                transferId: organDonation._id,
                organType: organDonation.organType,
                bloodType: organDonation.bloodType,
                donor: {
                    id: organDonation.donor._id,
                    name: organDonation.donor.name,
                },
                recipient: {
                    id: recipientId,
                    name: recipientName,
                    contact: recipientContact,
                },
                transferredAt: new Date(),
                notes: notes || 'No additional notes',
                status: 'Donated',
            }
        )
    );
});

/**
 * Update organ availability status
 * PATCH /api/v1/hospital/organ-donation/:donationId/status
 */
const updateOrganStatus = asyncHandler(async (req, res) => {
    const { donationId } = req.params;
    const { availability } = req.body;
    const hospitalId = req.hospitalId;

    if (!availability) {
        throw new ApiError(statusCode.BAD_REQUEST, 'Availability status is required');
    }

    const validStatuses = ['Available', 'Reserved', 'Donated', 'Expired'];
    if (!validStatuses.includes(availability)) {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        );
    }

    const organDonation = await OrganDonation.findOne({
        _id: donationId,
        hospital: hospitalId,
    });

    if (!organDonation) {
        throw new ApiError(
            statusCode.NOT_FOUND,
            'Organ not found in your hospital inventory'
        );
    }

    organDonation.availability = availability;
    await organDonation.save();

    return res.status(statusCode.OK).json(
        new ApiResponse(
            statusCode.OK,
            'Organ status updated successfully',
            {
                donationId: organDonation._id,
                organType: organDonation.organType,
                previousStatus: organDonation.availability,
                newStatus: availability,
                updatedAt: organDonation.updatedAt,
            }
        )
    );
});


export {addBloodDonation, giveBloodDonation, getEmergenciesByHospital, getEmergencyById, addOrganToInventory, getHospitalInventory, transferOrgan, updateOrganStatus};
