import {Router} from 'express';
import {getUserByPhoneNumber} from '../controllers/user/user.controller.js';
import {verifyAccessToken} from '../middlewares/index.js';
import {
    createEmergencyAlert,
    upload,
} from '../controllers/emergency.controller.js';

const user = Router();

user.route('/:phoneNumber').get(getUserByPhoneNumber);
user.post(
    '/emergency',
    verifyAccessToken,
    upload.single('audioVideo'),
    createEmergencyAlert
);

export default user;
