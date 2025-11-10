import {Router} from 'express';
import {getUserByPhoneNumber, getUser} from '../controllers/user/user.controller.js';
import {verifyAccessToken} from '../middlewares/index.js';
import {
    createEmergencyAlert,
    upload,
    callAmbulance, requestBloodEmergency, deleteEmergency
} from '../controllers/emergency.controller.js';

const user = Router();

user.route('/:phoneNumber').get(getUserByPhoneNumber);

user.route('/').get(verifyAccessToken, getUser);
user.post(
    '/emergency',
    verifyAccessToken,
    upload.single('audioVideo'),
    createEmergencyAlert
);

user.post('/ambulance', verifyAccessToken, callAmbulance);
user.post('/raiseBloodRequest', verifyAccessToken, requestBloodEmergency);
user.delete('/deleteEmergency', verifyAccessToken, deleteEmergency);

export default user;
