import {Router} from 'express';
import {
    addBloodDonation,
    giveBloodDonation
} from '../controllers/hospital/hospital.controller.js';
import {verifyAccessToken} from '../middlewares/index.js';
import {deleteEmergency} from "../controllers/emergency.controller.js";

const hospitalRouter = Router();

hospitalRouter.route('/addBloodDonation').post(verifyAccessToken, addBloodDonation);
hospitalRouter
    .route('/giveBloodDonation')
    .post(verifyAccessToken, giveBloodDonation);
hospitalRouter
    .route('/deleteEmergency')
    .delete(verifyAccessToken, deleteEmergency);


export default hospitalRouter;
