import {Router} from 'express';
import {
    addMedicine, updateMedicine, getAllMedicines, deleteMedicine
} from '../controllers/medicine.controller.js';
import {verifyAccessToken} from '../middlewares/index.js';

const pharmacy = Router();

pharmacy.route('/getAllMedicines').get(verifyAccessToken, getAllMedicines);
pharmacy.route('/addNewMedicine').post(verifyAccessToken, addMedicine);
pharmacy.route('/updateMedicine/:medicineId').put(verifyAccessToken, updateMedicine);
pharmacy.route('/deleteMedicine/:medicineId').delete(verifyAccessToken, deleteMedicine);

export default pharmacy;