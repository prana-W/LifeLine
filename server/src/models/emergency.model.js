import mongoose, { Schema } from 'mongoose';
import AnalyticsService from '../services/analytics.service.js';

const emergencySchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['emergency', 'ambulance', 'blood'],
            required: true,
            default: 'emergency'
        },
        hospitalsNotified: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Hospital',
            },
        ],
        pinCode: {
            type: String,
            required: true,
        },
        location: {
            latitude: { type: Number},
            longitude: { type: Number },
            address: { type: String },
            city: { type: String },
            state: { type: String },
        },
        audioVideoUrl: {
            type: String,
        },
        // Blood request specific fields
        bloodRequest: {
            bloodType: {
                type: String,
                enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            },
            unitsRequired: {
                type: Number,
                min: 1,
                max: 10,
            },
            urgencyLevel: {
                type: String,
                enum: ['Critical', 'High', 'Medium', 'Low'],
            },
            patientName: {
                type: String,
            },
            reason: {
                type: String,
            },
            contactNumber: {
                type: String,
            },
        },
        timestamp: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['pending', 'responding', 'resolved', 'cancelled'],
            default: 'pending',
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        resolvedAt: {
            type: Date,
        },
    }
);

// Analytics tracking - after emergency is created
emergencySchema.post('save', async function(doc) {
    try {
        if (doc.pinCode) {
            await AnalyticsService.updateEmergency(
                doc.pinCode,
                doc.type,
                doc.status
            );

            // If it's a blood request, also update blood analytics
            if (doc.type === 'blood' && doc.bloodRequest && doc.bloodRequest.bloodType) {
                await AnalyticsService.updateBloodDonation(
                    doc.pinCode,
                    doc.bloodRequest.bloodType,
                    'received'
                );
            }
        }
    } catch (error) {
        console.error('Error updating emergency analytics on save:', error);
    }
});

// Analytics tracking - when emergency status is updated
emergencySchema.post('findOneAndUpdate', async function(doc) {
    try {
        if (doc && doc.pinCode) {
            await AnalyticsService.updateEmergency(
                doc.pinCode,
                doc.type,
                doc.status
            );
        }
    } catch (error) {
        console.error('Error updating emergency analytics on update:', error);
    }
});

const Emergency = mongoose.model('Emergency', emergencySchema);
export default Emergency;