import mongoose, { Schema } from 'mongoose';

const emergencySchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
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
            address: { type: String }, // Full address from OpenStreetMap
            city: { type: String },
            state: { type: String },
        },
        audioVideoUrl: {
            type: String, // Combined audio/video recording URL
        },
        timestamp: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'responding', 'resolved'],
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