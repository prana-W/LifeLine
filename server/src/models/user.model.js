import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import {ApiError} from "../utility/index.js";
import statusCode from "../constants/statusCode.js";
import jwt from "jsonwebtoken";
import Pharmacy from "./pharmacy.model.js";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    pinCode: {
        type: String,
        required: true
    },
    location: {
        type: String,
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

});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);

    next();
});

userSchema.methods.generateAccessTokenFromUserId = async (
    userId
) => {
    try {

        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(
                statusCode.BAD_REQUEST,
                'User not found while creating refreshToken'
            );
        }

        const payload = {
            userId: user?._id,
            phone: user?.phoneNumber,
            pinCode: user?.pinCode
        };

        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        });

    } catch (error) {
        throw error;
    }
};

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;