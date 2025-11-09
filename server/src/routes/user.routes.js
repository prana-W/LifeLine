import {Router} from 'express';
import {
    getUserByPhoneNumber
} from '../controllers/user/user.controller.js';

const user = Router();

user.route('/:phoneNumber').get(getUserByPhoneNumber);

export default user;