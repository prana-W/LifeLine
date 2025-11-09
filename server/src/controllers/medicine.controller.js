import { ApiError, ApiResponse, asyncHandler } from '../utility/index.js';
import statusCode from '../constants/statusCode.js';
import Medicine from '../models/medicine.model.js';

const addMedicine = asyncHandler(async (req, res) => {
    const pharmacyId = req?.userId;
    const { name, quantity, price } = req?.body;

    if (!name) {
        throw new ApiError(statusCode.BAD_REQUEST, 'Medicine name is required!');
    }

    const medicine = await Medicine.create({
        name,
        quantity: quantity || 0,
        price,
        pharmacy: pharmacyId
    });

    return res.status(statusCode.CREATED).json(
        new ApiResponse(statusCode.CREATED, 'Medicine added successfully.', {
            medicine
        })
    );
});

const updateMedicine = asyncHandler(async (req, res) => {

    const pharmacyId = req?.userId;

    const { medicineId } = req?.params;
    const { delta } = req?.body;

    const medicine = await Medicine.findOne({
        _id: medicineId,
        pharmacy: pharmacyId
    });

    if (!medicine) {
        throw new ApiError(
            statusCode.NOT_FOUND,
            'Medicine not found or unauthorized!'
        );
    }

    if (delta !== undefined) medicine.quantity = medicine?.quantity + delta;

    await medicine.save();

    return res.status(statusCode.OK).json(
        new ApiResponse(statusCode.OK, 'Medicine updated successfully.', {
            medicine
        })
    );
});

const getAllMedicines = asyncHandler(async (req, res) => {
    const pharmacyId = req?.userId; // returns the pharmacy id

    const medicines = await Medicine.find({ pharmacy: pharmacyId }).sort({ name: 1 });

    return res.status(statusCode.OK).json(
        new ApiResponse(statusCode.OK, 'Medicines fetched successfully.', {
            count: medicines.length,
            medicines
        })
    );
});

const deleteMedicine = asyncHandler(async (req, res) => {
    const pharmacyId = req?.userId;
    const { medicineId } = req?.params;

    const medicine = await Medicine.findOneAndDelete({
        _id: medicineId,
        pharmacy: pharmacyId
    });

    if (!medicine) {
        throw new ApiError(
            statusCode.NOT_FOUND,
            'Medicine not found or unauthorized!'
        );
    }

    return res.status(statusCode.OK).json(
        new ApiResponse(statusCode.OK, 'Medicine deleted successfully.')
    );
});

export { addMedicine, updateMedicine, getAllMedicines, deleteMedicine };