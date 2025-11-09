import { ApiError, ApiResponse, asyncHandler } from "../../utility/index.js";
import statusCode from "../../constants/statusCode.js";
import BloodDonation from "../../models/bloodDonation.model.js";
import Hospital from "../../models/hospital.model.js";
import Donor from "../../models/donor.model.js"; // Assuming you have a Donor model

// 🩸 Add New Blood Donation
const addBloodDonation = asyncHandler(async (req, res) => {
    const { donorId, bloodType, quantity, donationDate } = req.body;

    // 🧩 1. Validate fields
    if (!donorId || !bloodType || !quantity) {
        throw new ApiError(statusCode.BAD_REQUEST, "All fields are required!");
    }

    // 🧩 2. Validate hospital (either from token or body)
    const hospitalId = req.userId || req.body.hospitalId;

    if (!hospitalId) {
        throw new ApiError(statusCode.UNAUTHORIZED, "Hospital not authenticated!");
    }

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
        throw new ApiError(statusCode.NOT_FOUND, "Hospital not found!");
    }

    // 🧩 3. Validate donor
    const donor = await Donor.findById(donorId);
    if (!donor) {
        throw new ApiError(statusCode.NOT_FOUND, "Donor not found!");
    }

    // 🩸 4. Create new blood donation record
    const donation = await BloodDonation.create({
        donor: donorId,
        hospital: hospitalId,
        bloodType,
        quantity,
        donationDate: donationDate || new Date(),
    });

    // ✅ 5. Send success response
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
