import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            default: 0
        },
        price: {
            type: Number
        },
        pharmacy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pharmacy',
            required: true
        }
    }
);

const Medicine = mongoose.model('Medicine', medicineSchema);

export default Medicine;