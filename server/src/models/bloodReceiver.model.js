import mongoose, {Schema} from 'mongoose';

const bloodReceiverSchema = new Schema({
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true,
    },
    bloodType: {
        type: String,
        required: true,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    quantity: {
        type: Number,
    },
    receiveDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

const BloodReceiver = mongoose.model('BloodReceiver', bloodReceiverSchema);

export default BloodReceiver;
