import mongoose, { Schema } from 'mongoose';

const analyticsSchema = new Schema(
    {
        pinCode: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        // Blood Bank Analytics
        bloodBank: {
            totalDonations: { type: Number, default: 0 },
            totalRequests: { type: Number, default: 0 },
            totalFulfilled: { type: Number, default: 0 },
            byBloodGroup: {
                'A+': { donated: { type: Number, default: 0 }, received: { type: Number, default: 0 } },
                'A-': { donated: { type: Number, default: 0 }, received: { type: Number, default: 0 } },
                'B+': { donated: { type: Number, default: 0 }, received: { type: Number, default: 0 } },
                'B-': { donated: { type: Number, default: 0 }, received: { type: Number, default: 0 } },
                'AB+': { donated: { type: Number, default: 0 }, received: { type: Number, default: 0 } },
                'AB-': { donated: { type: Number, default: 0 }, received: { type: Number, default: 0 } },
                'O+': { donated: { type: Number, default: 0 }, received: { type: Number, default: 0 } },
                'O-': { donated: { type: Number, default: 0 }, received: { type: Number, default: 0 } },
            },
        },

        // Organ Donation Analytics
        organDonation: {
            totalRegistrations: { type: Number, default: 0 },
            totalDonated: { type: Number, default: 0 },
            totalRequests: { type: Number, default: 0 },
            byOrganType: {
                Heart: { registered: { type: Number, default: 0 }, donated: { type: Number, default: 0 } },
                Kidney: { registered: { type: Number, default: 0 }, donated: { type: Number, default: 0 } },
                Liver: { registered: { type: Number, default: 0 }, donated: { type: Number, default: 0 } },
                Lung: { registered: { type: Number, default: 0 }, donated: { type: Number, default: 0 } },
                Pancreas: { registered: { type: Number, default: 0 }, donated: { type: Number, default: 0 } },
                Cornea: { registered: { type: Number, default: 0 }, donated: { type: Number, default: 0 } },
                Intestine: { registered: { type: Number, default: 0 }, donated: { type: Number, default: 0 } },
                'Bone Marrow': { registered: { type: Number, default: 0 }, donated: { type: Number, default: 0 } },
                Skin: { registered: { type: Number, default: 0 }, donated: { type: Number, default: 0 } },
                Other: { registered: { type: Number, default: 0 }, donated: { type: Number, default: 0 } },
            },
            byConsentType: {
                Living: { type: Number, default: 0 },
                Posthumous: { type: Number, default: 0 },
            },
        },

        // Emergency Services Analytics
        emergencyServices: {
            totalEmergencies: { type: Number, default: 0 },
            totalAmbulanceCalls: { type: Number, default: 0 },
            totalResolved: { type: Number, default: 0 },
            totalPending: { type: Number, default: 0 },
            averageResponseTime: { type: Number, default: 0 }, // in minutes
            byStatus: {
                pending: { type: Number, default: 0 },
                responding: { type: Number, default: 0 },
                resolved: { type: Number, default: 0 },
                cancelled: { type: Number, default: 0 },
            },
        },

        // Medicine Analytics
        medicines: {
            totalMedicines: { type: Number, default: 0 },
            totalQuantity: { type: Number, default: 0 },
            totalPharmacies: { type: Number, default: 0 },
            topMedicines: [
                {
                    medicineName: String,
                    quantity: Number,
                    searches: Number,
                }
            ],
        },

        // Hospital Analytics
        hospitals: {
            totalHospitals: { type: Number, default: 0 },
            totalBeds: { type: Number, default: 0 },
            totalOccupiedBeds: { type: Number, default: 0 },
            totalAvailableBeds: { type: Number, default: 0 },
            bySpecialization: {
                General: { type: Number, default: 0 },
                Cardiology: { type: Number, default: 0 },
                Neurology: { type: Number, default: 0 },
                Orthopedics: { type: Number, default: 0 },
                Pediatrics: { type: Number, default: 0 },
                Oncology: { type: Number, default: 0 },
                Other: { type: Number, default: 0 },
            },
        },

        // Pharmacy Analytics
        pharmacies: {
            totalPharmacies: { type: Number, default: 0 },
            total24x7Pharmacies: { type: Number, default: 0 },
            totalMedicinesAvailable: { type: Number, default: 0 },
        },

        // User Analytics
        users: {
            totalUsers: { type: Number, default: 0 },
            totalVisitors: { type: Number, default: 0 },
            newUsersThisMonth: { type: Number, default: 0 },
            activeUsers: { type: Number, default: 0 },
        },

        // Platform Engagement
        engagement: {
            totalAppointments: { type: Number, default: 0 },
            totalSearches: { type: Number, default: 0 },
            totalReviews: { type: Number, default: 0 },
            averageRating: { type: Number, default: 0 },
        }
    },
    { timestamps: true }
);

const Analytics = mongoose.model('Analytics', analyticsSchema);
export default Analytics;