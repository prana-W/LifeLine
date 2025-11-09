import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import {ApiError} from '../utility/index.js';
import statusCode from '../constants/statusCode.js';
import bcrypt from 'bcrypt';

const pharmacySchema = new mongoose.Schema(
    {
        shopName: {
            type: String,
        },
        phoneNumber: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        ownerName: {
            type: String
        },
        licenseNumber: {
            type: String,
            required: true,
            unique: true
        },
        pinCode: {
            type: String,
            required: true
        },
        location: {
            type: String,
            default: ''
        }
    },
    {timestamps: true}
);

pharmacySchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);

    next();
});

pharmacySchema.methods.generateAccessTokenFromUserId = async (
userId
) => {
    try {

        const user = await Pharmacy.findById(userId);

        if (!user) {
            throw new ApiError(
                statusCode.BAD_REQUEST,
                'User not found while creating refreshToken'
            );
        }

        const payload = {
            userId: user?._id,
            email: user?.email,
            pinCode: user?.pinCode
        };

        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        });

    } catch (error) {
        throw error;
    }
};

pharmacySchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const Pharmacy = mongoose.model('Pharmacy', pharmacySchema);

export default Pharmacy;