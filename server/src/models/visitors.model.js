import mongoose from 'mongoose';
import AnalyticsService from '../services/analytics.service.js';

const visitorSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    count: {type: Number, default: 0},
});

// Analytics tracking - when visitor count is updated
visitorSchema.pre('findOneAndUpdate', async function(next) {
    try {
        // Get the original document to compare count changes
        this._originalDoc = await this.model.findOne(this.getQuery());
        next();
    } catch (error) {
        console.error('Error in visitor pre-update:', error);
        next();
    }
});

visitorSchema.post('findOneAndUpdate', async function(doc) {
    try {
        if (doc && this._originalDoc) {
            const oldCount = this._originalDoc.count || 0;
            const newCount = doc.count || 0;
            const visitDiff = newCount - oldCount;

            // If count increased, track the visits
            // Note: Since this model doesn't have pinCode, you'll need to determine how to get it
            // Option 1: If 'name' is the pinCode itself
            if (visitDiff > 0 && doc.name) {
                for (let i = 0; i < visitDiff; i++) {
                    await AnalyticsService.updateUser(
                        doc.name, // Assuming 'name' is the pinCode
                        'visit'
                    );
                }
            }
        }
    } catch (error) {
        console.error('Error updating visitor analytics on update:', error);
    }
});

// Analytics tracking - after new visitor entry is created
visitorSchema.post('save', async function(doc) {
    try {
        if (this.isNew && doc.name && doc.count > 0) {
            // Track initial visits when a new visitor document is created
            for (let i = 0; i < doc.count; i++) {
                await AnalyticsService.updateUser(
                    doc.name, // Assuming 'name' is the pinCode
                    'visit'
                );
            }
        }
    } catch (error) {
        console.error('Error updating visitor analytics on save:', error);
    }
});

const Visitor = mongoose.model('Visitor', visitorSchema);

export default Visitor;