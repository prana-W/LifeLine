import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import {ApiError} from '../utility/index.js';
import statusCode from '../constants/statusCode.js';
import jwt from 'jsonwebtoken';

const bloodInventorySchema = new mongoose.Schema(
    {
        'A+': {type: Number, default: 0},
        'A-': {type: Number, default: 0},
        'B+': {type: Number, default: 0},
        'B-': {type: Number, default: 0},
        'AB+': {type: Number, default: 0},
        'AB-': {type: Number, default: 0},
        'O+': {type: Number, default: 0},
        'O-': {type: Number, default: 0},
    },
    {_id: false}
);

const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    pinCode: {
        type: String,
        required: true,
    },
    location: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    bloodInventory: {
        type: bloodInventorySchema,
        default: () => ({}),
    },
});

hospitalSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

hospitalSchema.methods.generateAccessTokenFromUserId = async (userId) => {
    try {
        const user = await Hospital.findById(userId);

        if (!user) {
            throw new ApiError(
                statusCode.BAD_REQUEST,
                'User not found while creating refreshToken'
            );
        }

        const payload = {
            userId: user._id,
            email: user.email,
            pinCode: user.pinCode,
        };

        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        });
    } catch (error) {
        throw error;
    }
};

hospitalSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const Hospital = mongoose.model('Hospital', hospitalSchema);

export default Hospital;
