import {Router} from 'express';
import {
    addBloodDonation,
    giveBloodDonation,
    getEmergenciesByHospital
} from '../controllers/hospital/hospital.controller.js';
import {verifyAccessToken} from '../middlewares/index.js';

const hospitalRouter = Router();

hospitalRouter.route('/addBloodDonation').post(verifyAccessToken, addBloodDonation);
hospitalRouter
    .route('/giveBloodDonation')
    .post(verifyAccessToken, giveBloodDonation);
hospitalRouter
    .route('/getEmergency')
    .get(verifyAccessToken, getEmergenciesByHospital);

export default hospitalRouter;
