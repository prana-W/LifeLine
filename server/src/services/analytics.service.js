import Analytics from '../models/analytics.model.js';

class AnalyticsService {
    /**
     * Initialize analytics for a new PIN code
     */
    static async initializeAnalytics(pinCode) {
        try {
            const existing = await Analytics.findOne({ pinCode });
            if (existing) {
                return existing;
            }

            const analytics = await Analytics.create({ pinCode });
            console.log(`📊 Initialized analytics for PIN code: ${pinCode}`);
            return analytics;
        } catch (error) {
            console.error('Error initializing analytics:', error);
            throw error;
        }
    }

    /**
     * Update blood donation analytics
     */
    static async updateBloodDonation(pinCode, bloodGroup, action = 'donated') {
        try {
            let analytics = await Analytics.findOne({ pinCode });

            if (!analytics) {
                analytics = await this.initializeAnalytics(pinCode);
            }

            if (action === 'donated') {
                analytics.bloodBank.totalDonations += 1;
                analytics.bloodBank.byBloodGroup[bloodGroup].donated += 1;
            } else if (action === 'received') {
                analytics.bloodBank.totalRequests += 1;
                analytics.bloodBank.byBloodGroup[bloodGroup].received += 1;
            } else if (action === 'fulfilled') {
                analytics.bloodBank.totalFulfilled += 1;
            }

            await analytics.save();
            return analytics;
        } catch (error) {
            console.error('Error updating blood donation analytics:', error);
            throw error;
        }
    }

    /**
     * Update organ donation analytics
     */
    static async updateOrganDonation(pinCode, organType, action = 'registered', consentType = null) {
        try {
            let analytics = await Analytics.findOne({ pinCode });

            if (!analytics) {
                analytics = await this.initializeAnalytics(pinCode);
            }

            if (action === 'registered') {
                analytics.organDonation.totalRegistrations += 1;
                analytics.organDonation.byOrganType[organType].registered += 1;

                if (consentType) {
                    analytics.organDonation.byConsentType[consentType] += 1;
                }
            } else if (action === 'donated') {
                analytics.organDonation.totalDonated += 1;
                analytics.organDonation.byOrganType[organType].donated += 1;
            } else if (action === 'requested') {
                analytics.organDonation.totalRequests += 1;
            }

            await analytics.save();
            return analytics;
        } catch (error) {
            console.error('Error updating organ donation analytics:', error);
            throw error;
        }
    }

    /**
     * Update emergency services analytics
     */
    static async updateEmergency(pinCode, type = 'emergency', status = 'pending') {
        try {
            let analytics = await Analytics.findOne({ pinCode });

            if (!analytics) {
                analytics = await this.initializeAnalytics(pinCode);
            }

            if (type === 'emergency') {
                analytics.emergencyServices.totalEmergencies += 1;
            } else if (type === 'ambulance') {
                analytics.emergencyServices.totalAmbulanceCalls += 1;
            }

            // Update status counts
            if (status === 'resolved') {
                analytics.emergencyServices.totalResolved += 1;
                analytics.emergencyServices.byStatus.resolved += 1;

                // Decrease pending if it was pending before
                if (analytics.emergencyServices.totalPending > 0) {
                    analytics.emergencyServices.totalPending -= 1;
                    if (analytics.emergencyServices.byStatus.pending > 0) {
                        analytics.emergencyServices.byStatus.pending -= 1;
                    }
                }
            } else if (status === 'pending') {
                analytics.emergencyServices.totalPending += 1;
                analytics.emergencyServices.byStatus.pending += 1;
            } else if (status === 'responding') {
                analytics.emergencyServices.byStatus.responding += 1;

                // Decrease pending if transitioning from pending to responding
                if (analytics.emergencyServices.byStatus.pending > 0) {
                    analytics.emergencyServices.byStatus.pending -= 1;
                }
            } else if (status === 'cancelled') {
                analytics.emergencyServices.byStatus.cancelled += 1;

                if (analytics.emergencyServices.totalPending > 0) {
                    analytics.emergencyServices.totalPending -= 1;
                }
                if (analytics.emergencyServices.byStatus.pending > 0) {
                    analytics.emergencyServices.byStatus.pending -= 1;
                }
            }

            await analytics.save();
            return analytics;
        } catch (error) {
            console.error('Error updating emergency analytics:', error);
            throw error;
        }
    }

    /**
     * Update hospital analytics
     */
    static async updateHospital(pinCode, action = 'add', data = {}) {
        try {
            let analytics = await Analytics.findOne({ pinCode });

            if (!analytics) {
                analytics = await this.initializeAnalytics(pinCode);
            }

            if (action === 'add') {
                analytics.hospitals.totalHospitals += 1;

                if (data.specialization) {
                    const spec = data.specialization in analytics.hospitals.bySpecialization
                        ? data.specialization
                        : 'Other';
                    analytics.hospitals.bySpecialization[spec] += 1;
                }

                if (data.totalBeds) {
                    analytics.hospitals.totalBeds += data.totalBeds;
                    analytics.hospitals.totalAvailableBeds += data.totalBeds;
                }
            } else if (action === 'updateBeds') {
                // Recalculate bed availability
                if (data.totalAvailableBeds !== undefined) {
                    analytics.hospitals.totalAvailableBeds = data.totalAvailableBeds;
                }
                if (data.totalOccupiedBeds !== undefined) {
                    analytics.hospitals.totalOccupiedBeds = data.totalOccupiedBeds;
                }
            } else if (action === 'remove') {
                if (analytics.hospitals.totalHospitals > 0) {
                    analytics.hospitals.totalHospitals -= 1;
                }
            }

            await analytics.save();
            return analytics;
        } catch (error) {
            console.error('Error updating hospital analytics:', error);
            throw error;
        }
    }

    /**
     * Update pharmacy analytics
     */
    static async updatePharmacy(pinCode, action = 'add', data = {}) {
        try {
            let analytics = await Analytics.findOne({ pinCode });

            if (!analytics) {
                analytics = await this.initializeAnalytics(pinCode);
            }

            if (action === 'add') {
                analytics.pharmacies.totalPharmacies += 1;

                if (data.is24x7) {
                    analytics.pharmacies.total24x7Pharmacies += 1;
                }
            } else if (action === 'addMedicine') {
                analytics.pharmacies.totalMedicinesAvailable += (data.quantity || 1);
            } else if (action === 'removeMedicine') {
                analytics.pharmacies.totalMedicinesAvailable -= (data.quantity || 1);
                if (analytics.pharmacies.totalMedicinesAvailable < 0) {
                    analytics.pharmacies.totalMedicinesAvailable = 0;
                }
            } else if (action === 'remove') {
                if (analytics.pharmacies.totalPharmacies > 0) {
                    analytics.pharmacies.totalPharmacies -= 1;
                }
            }

            await analytics.save();
            return analytics;
        } catch (error) {
            console.error('Error updating pharmacy analytics:', error);
            throw error;
        }
    }

    /**
     * Update medicine analytics
     */
    static async updateMedicine(pinCode, medicineName, quantity = 1) {
        try {
            let analytics = await Analytics.findOne({ pinCode });

            if (!analytics) {
                analytics = await this.initializeAnalytics(pinCode);
            }

            analytics.medicines.totalMedicines += 1;
            analytics.medicines.totalQuantity += quantity;

            // Update top medicines
            const existingMedicine = analytics.medicines.topMedicines.find(
                m => m.medicineName === medicineName
            );

            if (existingMedicine) {
                existingMedicine.quantity += quantity;
                existingMedicine.searches += 1;
            } else {
                analytics.medicines.topMedicines.push({
                    medicineName,
                    quantity,
                    searches: 1,
                });
            }

            // Keep only top 20 medicines
            analytics.medicines.topMedicines.sort((a, b) => b.searches - a.searches);
            analytics.medicines.topMedicines = analytics.medicines.topMedicines.slice(0, 20);

            await analytics.save();
            return analytics;
        } catch (error) {
            console.error('Error updating medicine analytics:', error);
            throw error;
        }
    }

    /**
     * Update user analytics
     */
    static async updateUser(pinCode, action = 'register') {
        try {
            let analytics = await Analytics.findOne({ pinCode });

            if (!analytics) {
                analytics = await this.initializeAnalytics(pinCode);
            }

            if (action === 'register') {
                analytics.users.totalUsers += 1;
                analytics.users.newUsersThisMonth += 1;
            } else if (action === 'visit') {
                analytics.users.totalVisitors += 1;
            } else if (action === 'active') {
                analytics.users.activeUsers += 1;
            }

            await analytics.save();
            return analytics;
        } catch (error) {
            console.error('Error updating user analytics:', error);
            throw error;
        }
    }

    /**
     * Update engagement analytics
     */
    static async updateEngagement(pinCode, action, data = {}) {
        try {
            let analytics = await Analytics.findOne({ pinCode });

            if (!analytics) {
                analytics = await this.initializeAnalytics(pinCode);
            }

            if (action === 'appointment') {
                analytics.engagement.totalAppointments += 1;
            } else if (action === 'search') {
                analytics.engagement.totalSearches += 1;
            } else if (action === 'review') {
                analytics.engagement.totalReviews += 1;

                if (data.rating) {
                    const currentTotal = analytics.engagement.averageRating * (analytics.engagement.totalReviews - 1);
                    analytics.engagement.averageRating = (currentTotal + data.rating) / analytics.engagement.totalReviews;
                }
            }

            await analytics.save();
            return analytics;
        } catch (error) {
            console.error('Error updating engagement analytics:', error);
            throw error;
        }
    }

    /**
     * Get analytics for a specific PIN code
     */
    static async getAnalyticsByPinCode(pinCode) {
        try {
            const analytics = await Analytics.findOne({ pinCode });
            return analytics;
        } catch (error) {
            console.error('Error fetching analytics:', error);
            throw error;
        }
    }

    /**
     * Get aggregated analytics for entire platform
     */
    static async getPlatformAnalytics() {
        try {
            const result = await Analytics.aggregate([
                {
                    $group: {
                        _id: null,
                        totalPinCodes: { $sum: 1 },
                        totalBloodDonations: { $sum: '$bloodBank.totalDonations' },
                        totalOrganDonations: { $sum: '$organDonation.totalDonated' },
                        totalEmergencies: { $sum: '$emergencyServices.totalEmergencies' },
                        totalHospitals: { $sum: '$hospitals.totalHospitals' },
                        totalPharmacies: { $sum: '$pharmacies.totalPharmacies' },
                        totalUsers: { $sum: '$users.totalUsers' },
                        totalVisitors: { $sum: '$users.totalVisitors' },
                    }
                }
            ]);

            return result[0] || {};
        } catch (error) {
            console.error('Error fetching platform analytics:', error);
            throw error;
        }
    }
}

export default AnalyticsService;