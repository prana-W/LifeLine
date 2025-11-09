import {Router} from 'express';
import {addBloodDonation} from '../controllers/hospital/hospital.controller.js';
import {verifyAccessToken} from '../middlewares/index.js';

const authRouter = Router();

authRouter.route('/addBloodDonation').post(verifyAccessToken, addBloodDonation);

export default authRouter;
