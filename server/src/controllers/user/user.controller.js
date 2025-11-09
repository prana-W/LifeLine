import {ApiError, ApiResponse, asyncHandler} from '../../utility/index.js';
import statusCode from '../../constants/statusCode.js';
import User from '../../models/user.model.js';

const getUserByPhoneNumber = asyncHandler(async (req, res) => {
    const {phoneNumber} = req.params;
    console.log(phoneNumber);

    if (!phoneNumber) {
        throw new ApiError(statusCode.BAD_REQUEST, 'Phone number is required!');
    }

    const user = await User.findOne({phoneNumber: phoneNumber});

    if (!user) {
        throw new ApiError(statusCode.NOT_FOUND, 'User not found!');
    }

    return res
        .status(statusCode.OK)
        .json(
            new ApiResponse(
                statusCode.OK,
                'User details fetched successfully.',
                user
            )
        );
});

const callAmbulance = (asyncHandler(async (req, res) => {

}));

export {getUserByPhoneNumber};
