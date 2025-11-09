import {ApiError, ApiResponse, asyncHandler} from '../../utility/index.js';
import statusCode from '../../constants/statusCode.js';
import cookieOptions from '../../constants/cookieOptions.js';
import Hospital from '../../models/hospital.model.js';

const signupUser = asyncHandler(async (req, res) => {
    const {name, pinCode, location, email, password} = req?.body;

    if (!name || !pinCode || !email || !password) {
        throw new ApiError(statusCode.BAD_REQUEST, 'All fields are required!');
    }

    const existingUser = await Hospital.findOne({
        $or: [{email}],
    });

    if (existingUser) {
        throw new ApiError(
            statusCode.CONFLICT,
            'Hospital is already registered! Kindly login back.'
        );
    }

    const user = await Hospital.create({
        name,
        pinCode,
        location,
        email,
        password,
    });

    return res.status(statusCode.OK).json(
        new ApiResponse(statusCode.OK, 'Hospital registered successfully.', {
            email: user?.email,
            name: user?.name,
        })
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req?.body;

    if (!email || !password) {
        throw new ApiError(statusCode.BAD_REQUEST, 'All fields are required!');
    }

    const user = await Hospital.findOne({
        $or: [{email}],
    });

    if (!user) {
        throw new ApiError(statusCode.NOT_FOUND, 'Hospital not found!');
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        throw new ApiError(statusCode.UNAUTHORIZED, 'Incorrect password!');
    }

    // After all validations, generate tokens, store refresh token in DB and send tokens in cookies

    const accessToken = await user.generateAccessTokenFromUserId(user?._id);

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
            new ApiResponse(
                statusCode.OK,
                'Hospital logged in successfully.',
                {}
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    const user = await Hospital.findById(req?.userId);

    if (!user) {
        throw new ApiError(
            statusCode.NOT_FOUND,
            'Hospital not found! Login first.'
        );
    }

    await user.save();

    return res
        .status(statusCode.OK)
        .cookie('accessToken', cookieOptions)
        .json(
            new ApiResponse(statusCode.OK, 'Hospital logged out successfully.')
        );
});

export {signupUser, loginUser, logoutUser};
