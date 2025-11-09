import { ApiError, ApiResponse, asyncHandler } from "../../utility/index.js";
import statusCode from "../../constants/statusCode.js";
import cookieOptions from "../../constants/cookieOptions.js";
import User from "../../models/user.model.js";

const signupUser = asyncHandler(async (req, res) => {

    const { name, phoneNumber, password, pinCode, location, bloodType } = req?.body;

    if (!name || !phoneNumber || !password || !pinCode || !bloodType) {
        throw new ApiError(statusCode.BAD_REQUEST, "All required fields must be provided!");
    }

    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
        throw new ApiError(
            statusCode.CONFLICT,
            "User already registered! Kindly login instead."
        );
    }

    const user = await User.create({
        name,
        phoneNumber,
        password,
        pinCode,
        location,
        bloodType,
    });

    return res.status(statusCode.OK).json(
        new ApiResponse(statusCode.OK, "User registered successfully.", {
            userId: user._id,
            name: user.name,
            phoneNumber: user.phoneNumber,
            bloodType: user.bloodType,
        })
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { phoneNumber, password } = req.body;


    if (!phoneNumber || !password) {
        throw new ApiError(statusCode.BAD_REQUEST, "All fields are required!");
    }

    const user = await User.findOne({ phoneNumber });
    if (!user) {
        throw new ApiError(statusCode.NOT_FOUND, "User not found!");
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        throw new ApiError(statusCode.UNAUTHORIZED, "Incorrect password!");
    }

    const accessToken = await user.generateAccessTokenFromUserId(user._id);
    if (!accessToken) {
        throw new ApiError(statusCode.INTERNAL_SERVER_ERROR, "Failed to generate access token.");
    }

    return res
        .status(statusCode.OK)
        .cookie("accessToken", accessToken, cookieOptions)
        .json(
            new ApiResponse(statusCode.OK, "User logged in successfully.", {
                name: user.name,
                phoneNumber: user.phoneNumber,
                userId: user?._id
            })
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId);

    if (!user) {
        throw new ApiError(statusCode.NOT_FOUND, "User not found! Please log in first.");
    }

    await user.save();

    return res
        .status(statusCode.OK)
        .cookie("accessToken", "", { ...cookieOptions, maxAge: 0 })
        .json(new ApiResponse(statusCode.OK, "User logged out successfully."));
});

export { signupUser, loginUser, logoutUser };
