import {Router} from 'express';
import {addBloodDonation, giveBloodDonation} from '../controllers/hospital/hospital.controller.js';
import {verifyAccessToken} from '../middlewares/index.js';

const authRouter = Router();

authRouter.route('/addBloodDonation').post(verifyAccessToken, addBloodDonation);
authRouter.route('/giveBloodDonation').post(verifyAccessToken, giveBloodDonation);

export default authRouter;
