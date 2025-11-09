import mongoose, { Schema } from 'mongoose';

const emergencySchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['emergency', 'ambulance'],
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
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true },
            address: { type: String },
            city: { type: String },
            state: { type: String },
        },
        audioVideoUrl: {
            type: String,
        },
        timestamp: {
            type: Date,
            required: true,
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

const Emergency = mongoose.model('Emergency', emergencySchema);
export default Emergency;