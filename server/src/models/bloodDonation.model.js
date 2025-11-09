import mongoose, { Schema } from "mongoose";

const bloodDonationSchema = new Schema(
    {
        donor: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        hospital: {
            type: Schema.Types.ObjectId,
            ref: "Hospital",
            required: true,
        },
        bloodType: {
            type: String,
            required: true,
            enum: [
                "A+",
                "A-",
                "B+",
                "B-",
                "AB+",
                "AB-",
                "O+",
                "O-"
            ],
        },
        quantity: {
            type: Number, // in milliliters (mL)
        },
        donationDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
    }
);

bloodDonationSchema.pre(/^find/, function (next) {
    this.populate("donor", "name bloodType phoneNumber").populate("hospital", "name location email");
    next();
});

const BloodDonation = mongoose.model("BloodDonation", bloodDonationSchema);

export default BloodDonation;
