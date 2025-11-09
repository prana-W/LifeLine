import {Router} from 'express';
import {
    loginUser,
    logoutUser,
    signupUser,
} from '../controllers/user/auth.controller.js';
import {verifyAccessToken} from '../middlewares/index.js';

const authRouter = Router();

authRouter.route('/signup').post(signupUser);
authRouter.route('/login').post(loginUser);
authRouter.route('/logout').post(verifyAccessToken, logoutUser);

export default authRouter;
