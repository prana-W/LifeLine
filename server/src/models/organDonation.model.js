import mongoose, { Schema } from 'mongoose';

const organDonationSchema = new Schema(
    {
        donor: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        hospital: {
            type: Schema.Types.ObjectId,
            ref: 'Hospital',
        },
        organType: {
            type: String,
            required: true,
            enum: [
                'Heart',
                'Kidney',
                'Liver',
                'Lung',
                'Pancreas',
                'Cornea',
                'Intestine',
                'Bone Marrow',
                'Skin',
                'Other',
            ],
        },
        bloodType: {
            type: String,
            required: true,
            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        },
        pinCode: {
            type: String,
            required: true,
        },
        availability: {
            type: String,
            enum: ['Available', 'Reserved', 'Donated', 'Expired'],
            default: 'Available',
        },
        consentType: {
            type: String,
            enum: ['Living', 'Posthumous'],
            required: true,
        },
        contactNumber: {
            type: String,
            required: true,
        },
        registeredAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

organDonationSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const OrganDonation = mongoose.model('OrganDonation', organDonationSchema);
export default OrganDonation;
