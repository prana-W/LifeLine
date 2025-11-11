import router from 'express';
import {getAnalyticsByPincode, getAllAnalytics} from '../controllers/analytics.controller.js';

const analyticsRouter = router.Router();

analyticsRouter.route('/pinCode/:pinCode').get(getAnalyticsByPincode);
analyticsRouter.route('/all').get(getAllAnalytics);

export default analyticsRouter;
