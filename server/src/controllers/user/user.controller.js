import {ApiError, ApiResponse, asyncHandler} from '../../utility/index.js';
import statusCode from '../../constants/statusCode.js';
import User from '../../models/user.model.js';
import OrganDonation from '../../models/organDonation.model.js';

const getUserByPhoneNumber = asyncHandler(async (req, res) => {
    const {phoneNumber} = req.params;
    console.log(phoneNumber);

    if (!phoneNumber) {
        throw new ApiError(statusCode.BAD_REQUEST, 'Phone number is required!');
    }

    const user = await User.findOne({phoneNumber: phoneNumber});

    if (!user) {
        throw new ApiError(statusCode.NOT_FOUND, 'User not found!');
    }

    return res
        .status(statusCode.OK)
        .json(
            new ApiResponse(
                statusCode.OK,
                'User details fetched successfully.',
                user
            )
        );
});

/**
 * Register as an organ donor
 * POST /api/v1/user/organ-donation/register
 */
const registerOrganDonor = asyncHandler(async (req, res) => {
    const { organType, bloodType, pinCode, consentType, contactNumber } = req.body;
    const userId = req.userId;

    // Validate required fields
    if (!organType || !bloodType || !pinCode || !consentType || !contactNumber) {
        throw new ApiError(statusCode.BAD_REQUEST, 'All fields are required');
    }

    // Check if user already registered for this organ type
    const existingDonation = await OrganDonation.findOne({
        donor: userId,
        organType: organType,
        availability: { $in: ['Available', 'Reserved'] }
    });

    if (existingDonation) {
        throw new ApiError(
            statusCode.CONFLICT,
            `You have already registered for ${organType} donation`
        );
    }

    // Create organ donation record
    const organDonation = await OrganDonation.create({
        donor: userId,
        organType,
        bloodType,
        pinCode,
        consentType,
        contactNumber,
        availability: 'Available',
    });

    // Populate donor details
    await organDonation.populate('donor', 'name email');

    return res.status(statusCode.CREATED).json(
        new ApiResponse(
            statusCode.CREATED,
            'Successfully registered as an organ donor',
            {
                donationId: organDonation._id,
                organType: organDonation.organType,
                bloodType: organDonation.bloodType,
                consentType: organDonation.consentType,
                availability: organDonation.availability,
                registeredAt: organDonation.registeredAt,
            }
        )
    );
});

/**
 * Search for available organs in user's area
 * GET /api/v1/user/organ-donation/search
 */
const searchAvailableOrgans = asyncHandler(async (req, res) => {
    const { organType, bloodType, pinCode, consentType } = req.query;

    // Build search query
    const searchQuery = {
        availability: 'Available',
    };

    if (organType) {
        searchQuery.organType = organType;
    }

    if (bloodType) {
        searchQuery.bloodType = bloodType;
    }

    if (pinCode) {
        searchQuery.pinCode = pinCode;
    }

    if (consentType) {
        searchQuery.consentType = consentType;
    }

    // Find available organs
    const availableOrgans = await OrganDonation.find(searchQuery)
        .populate('donor', 'name email')
        .populate('hospital', 'name address contact pinCode')
        .sort({ registeredAt: -1 });

    // Group by hospital and individual donors
    const hospitalOrgans = availableOrgans.filter(organ => organ.hospital);
    const individualDonors = availableOrgans.filter(organ => !organ.hospital);

    return res.status(statusCode.OK).json(
        new ApiResponse(
            statusCode.OK,
            'Available organs retrieved successfully',
            {
                totalCount: availableOrgans.length,
                hospitalInventory: {
                    count: hospitalOrgans.length,
                    organs: hospitalOrgans.map(organ => ({
                        id: organ._id,
                        organType: organ.organType,
                        bloodType: organ.bloodType,
                        hospital: organ.hospital,
                        consentType: organ.consentType,
                        registeredAt: organ.registeredAt,
                    }))
                },
                individualDonors: {
                    count: individualDonors.length,
                    donors: individualDonors.map(organ => ({
                        id: organ._id,
                        organType: organ.organType,
                        bloodType: organ.bloodType,
                        consentType: organ.consentType,
                        pinCode: organ.pinCode,
                        contactNumber: organ.contactNumber,
                        registeredAt: organ.registeredAt,
                    }))
                },
                searchCriteria: searchQuery,
            }
        )
    );
});

/**
 * Request an organ (mark as reserved)
 * POST /api/v1/user/organ-donation/request/:donationId
 */
const requestOrgan = asyncHandler(async (req, res) => {
    const { donationId } = req.params;
    const { reason, urgencyLevel } = req.body;
    const userId = req.userId;

    // Find the organ donation
    const organDonation = await OrganDonation.findById(donationId)
        .populate('donor', 'name email contactNumber')
        .populate('hospital', 'name contact address');

    if (!organDonation) {
        throw new ApiError(statusCode.NOT_FOUND, 'Organ donation record not found');
    }

    if (organDonation.availability !== 'Available') {
        throw new ApiError(
            statusCode.CONFLICT,
            `This organ is currently ${organDonation.availability.toLowerCase()}`
        );
    }

    // Update availability to Reserved
    organDonation.availability = 'Reserved';
    await organDonation.save();

    // TODO: Create a separate OrganRequest model to track requests
    // TODO: Notify donor/hospital about the request
    // TODO: Send email/SMS to donor and requester

    return res.status(statusCode.OK).json(
        new ApiResponse(
            statusCode.OK,
            'Organ request submitted successfully. The donor/hospital will be notified.',
            {
                requestId: organDonation._id,
                organType: organDonation.organType,
                bloodType: organDonation.bloodType,
                status: 'Reserved',
                donor: organDonation.hospital ? null : {
                    name: organDonation.donor.name,
                    contactNumber: organDonation.contactNumber,
                },
                hospital: organDonation.hospital || null,
                requestDetails: {
                    reason: reason || 'Not specified',
                    urgencyLevel: urgencyLevel || 'Normal',
                },
            }
        )
    );
});

/**
 * Get user's organ donation history
 * GET /api/v1/user/organ-donation/my-donations
 */
const getMyDonations = asyncHandler(async (req, res) => {
    const userId = req.userId;

    const myDonations = await OrganDonation.find({ donor: userId })
        .populate('hospital', 'name address contact')
        .sort({ registeredAt: -1 });

    return res.status(statusCode.OK).json(
        new ApiResponse(
            statusCode.OK,
            'Your donation records retrieved successfully',
            {
                totalDonations: myDonations.length,
                donations: myDonations.map(donation => ({
                    id: donation._id,
                    organType: donation.organType,
                    bloodType: donation.bloodType,
                    availability: donation.availability,
                    consentType: donation.consentType,
                    hospital: donation.hospital || null,
                    pinCode: donation.pinCode,
                    registeredAt: donation.registeredAt,
                    updatedAt: donation.updatedAt,
                }))
            }
        )
    );
});

/**
 * Cancel organ donation registration
 * DELETE /api/v1/user/organ-donation/:donationId
 */
const cancelDonation = asyncHandler(async (req, res) => {
    const { donationId } = req.params;
    const userId = req.userId;

    const organDonation = await OrganDonation.findOne({
        _id: donationId,
        donor: userId,
    });

    if (!organDonation) {
        throw new ApiError(
            statusCode.NOT_FOUND,
            'Donation record not found or you do not have permission'
        );
    }

    if (organDonation.availability === 'Donated') {
        throw new ApiError(
            statusCode.CONFLICT,
            'Cannot cancel a donation that has already been completed'
        );
    }

    // Mark as expired instead of deleting
    organDonation.availability = 'Expired';
    await organDonation.save();

    return res.status(statusCode.OK).json(
        new ApiResponse(
            statusCode.OK,
            'Organ donation registration cancelled successfully',
            {
                donationId: organDonation._id,
                organType: organDonation.organType,
                status: 'Expired',
            }
        )
    );
});

const getUser = asyncHandler(async (req, res) => {

    const userId = req.userId;

    if (!userId) {
        throw new ApiError(statusCode.NOT_FOUND, `User with id ${userId}`);
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(statusCode.NOT_FOUND, `User with id ${userId}`);
    }

    return res.status(statusCode.OK).json(new ApiResponse(statusCode.OK, 'User fetched', user));

})

export {getUserByPhoneNumber, registerOrganDonor, searchAvailableOrgans, requestOrgan, getMyDonations, cancelDonation, getUser};
