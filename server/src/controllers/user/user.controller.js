import {ApiError, ApiResponse, asyncHandler} from '../../utility/index.js';
import statusCode from '../../constants/statusCode.js';
import cookieOptions from '../../constants/cookieOptions.js';
import Pharmacy from "../../models/pharmacy.model.js";

const signupUser = asyncHandler(async (req, res) => {
    const {pinCode, licenseNumber, phoneNumber, password, shopName, location} = req?.body;

    if (!pinCode || !licenseNumber || !phoneNumber || !password) {
        throw new ApiError(statusCode.BAD_REQUEST, 'All fields are required!');
    }

    const existingUser = await Pharmacy.findOne({
        $or: [{phoneNumber}],
    });

    if (existingUser) {
        throw new ApiError(
            statusCode.CONFLICT,
            'Pharmacy is already registered! Kindly login back.'
        );
    }

    const user = await Pharmacy.create({pinCode, licenseNumber, phoneNumber, password, shopName, location});

    return res.status(statusCode.OK).json(
        new ApiResponse(statusCode.OK, 'Pharmacy registered successfully.', {
            licenseNumber: user?.licenseNumber,
        })
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const {phoneNumber, password} = req?.body;

    if (!phoneNumber || !password) {
        throw new ApiError(statusCode.BAD_REQUEST, 'All fields are required!');
    }

    const user = await Pharmacy.findOne({
        $or: [{phoneNumber}],
    });

    if (!user) {
        throw new ApiError(statusCode.NOT_FOUND, 'Pharmacy not found!');
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        throw new ApiError(statusCode.UNAUTHORIZED, 'Incorrect password!');
    }

    // After all validations, generate tokens, store refresh token in DB and send tokens in cookies

    const accessToken =
        await user.generateAccessTokenFromUserId(user?._id);

    if (!accessToken) {
        throw new ApiError(
            400,
            'Something went wrong while generating tokens.'
        );
    }

    return res
        .status(statusCode.OK)
        .cookie('accessToken', accessToken, cookieOptions)
        .json(
            new ApiResponse(statusCode.OK, 'Pharmacy logged in successfully.', {})
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    const user = await Pharmacy.findById(req?.userId);

    if (!user) {
        throw new ApiError(
            statusCode.NOT_FOUND,
            'Pharmacy not found! Login first.'
        );
    }

    await user.save();

    return res
        .status(statusCode.OK)
        .cookie('accessToken', cookieOptions)
        .json(new ApiResponse(statusCode.OK, 'Pharmacy logged out successfully.'));
});

export {signupUser, loginUser, logoutUser};