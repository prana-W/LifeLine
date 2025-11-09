import { ApiError, ApiResponse, asyncHandler } from "../../utility/index.js";
import statusCode from "../../constants/statusCode.js";
import BloodDonation from "../../models/bloodDonation.model.js";
import Hospital from "../../models/hospital.model.js";
import User from "../../models/user.model.js";

const addBloodDonation = asyncHandler(async (req, res) => {
    const { donorId, quantity } = req.body;

    if (!donorId || !quantity) {
        throw new ApiError(statusCode.BAD_REQUEST, "All fields are required!");
    }

    const hospitalId = req.userId; // Get userId, which is actually hospitalId

    if (!hospitalId) {
        throw new ApiError(statusCode.UNAUTHORIZED, "Hospital not authenticated!");
    }

    const hospital = await Hospital.findById(hospitalId);

    if (!hospital) {
        throw new ApiError(statusCode.NOT_FOUND, "Hospital not found!");
    }

    const donor = await User.findById(donorId);

    if (!donor) {
        throw new ApiError(statusCode.NOT_FOUND, "Donor not found!");
    }

    const donation = await BloodDonation.create({
        donor: donorId,
        hospital: hospitalId,
        bloodType: donor?.bloodType,
        quantity,
        donationDate: new Date(),
    });

    return res
        .status(statusCode.CREATED)
        .json(
            new ApiResponse(statusCode.CREATED, "Blood donation recorded successfully.", {
                donationId: donation._id,
                donor: donor.name,
                hospital: hospital.name,
                bloodType: donation.bloodType,
                quantity: donation.quantity,
                donationDate: donation.donationDate,
            })
        );
});

export { addBloodDonation };
