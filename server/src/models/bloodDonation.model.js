import mongoose, { Schema } from 'mongoose';
import AnalyticsService from '../services/analytics.service.js';
import User from './user.model.js';

const bloodDonationSchema = new Schema({
    donor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true,
    },
    bloodType: {
        type: String,
        required: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    quantity: {
        type: Number, // in milliliters (mL)
    },
    donationDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    pinCode: {
        type: String,
    },
});

// Auto-populate donor and hospital on find
bloodDonationSchema.pre(/^find/, function (next) {
    this.populate('donor', 'name bloodType phoneNumber')
        .populate('hospital', 'name location email pinCode');
    next();
});

// Add pinCode before saving
bloodDonationSchema.pre('save', async function (next) {
    try {
        if (!this.pinCode) {
            const donor = await User.findById(this.donor).select('pinCode');
            if (donor && donor.pinCode) {
                this.pinCode = donor.pinCode;
            }
        }
        next();
    } catch (error) {
        console.error('Error setting pinCode before save:', error);
        next(error);
    }
});

// Analytics tracking after saving (no re-save)
bloodDonationSchema.post('save', async function (doc) {
    try {
        // Populate hospital pinCode (for analytics)
        await doc.populate('hospital', 'pinCode');

        if (doc.hospital?.pinCode) {
            await AnalyticsService.updateBloodDonation(
                doc.hospital.pinCode,
                doc.bloodType,
                'donated'
            );
        }
    } catch (error) {
        console.error('Error updating blood donation analytics:', error);
    }
});

const BloodDonation = mongoose.model('BloodDonation', bloodDonationSchema);
export default BloodDonation;
