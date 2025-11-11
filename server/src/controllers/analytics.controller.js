import asyncHandler from '../utility/asyncHandler.js';
import ApiResponse from '../utility/apiResponse.js';
import ApiError from '../utility/apiError.js';
import statusCode from '../constants/statusCode.js';
import Analytics from '../models/analytics.model.js';
import User from '../models/user.model.js';
import Hospital from '../models/hospital.model.js';
import Pharmacy from '../models/pharmacy.model.js';

const getAnalyticsByPincode = asyncHandler(async (req, res) => {
    const { pinCode } = req.params;

    if (!pinCode) {
        throw new ApiError(statusCode.BAD_REQUEST, 'Pincode is required');
    }

    // Fetch analytics for the specific pincode
    const analytics = await Analytics.findOne({ pinCode: pinCode });

    if (!analytics) {
        throw new ApiError(statusCode.NOT_FOUND, `No analytics found for pincode ${pinCode}`);
    }

    // Get total counts from respective models
    const [totalUsers, totalHospitals, totalPharmacies] = await Promise.all([
        User.countDocuments(),
        Hospital.countDocuments({ pinCode: pinCode }),
        Pharmacy.countDocuments({ pinCode: pinCode })
    ]);

    // Prepare response data with headings and numbers
    const responseData = {
        pincode: pinCode,
        overview: {
            'Total Users': totalUsers,
            'Total Hospitals': totalHospitals,
            'Total Pharmacies': totalPharmacies,
        },
        bloodBank: {
            'Total Blood Donations': analytics.bloodBank.totalDonations,
            'Total Blood Requests': analytics.bloodBank.totalRequests,
            'Total Requests Fulfilled': analytics.bloodBank.totalFulfilled,
            byBloodGroup: analytics.bloodBank.byBloodGroup,
        },
        organDonation: {
            'Total Organ Registrations': analytics.organDonation.totalRegistrations,
            'Total Organs Donated': analytics.organDonation.totalDonated,
            'Total Organ Requests': analytics.organDonation.totalRequests,
            byOrganType: analytics.organDonation.byOrganType,
            byConsentType: {
                'Living Donations': analytics.organDonation.byConsentType.Living,
                'Posthumous Donations': analytics.organDonation.byConsentType.Posthumous,
            },
        },
        emergencyServices: {
            'Total Emergencies': analytics.emergencyServices.totalEmergencies,
            'Total Ambulance Calls': analytics.emergencyServices.totalAmbulanceCalls,
            'Total Resolved': analytics.emergencyServices.totalResolved,
            'Total Pending': analytics.emergencyServices.totalPending,
            'Average Response Time (minutes)': analytics.emergencyServices.averageResponseTime,
            byStatus: analytics.emergencyServices.byStatus,
        },
        medicines: {
            'Total Medicines': analytics.medicines.totalMedicines,
            'Total Quantity': analytics.medicines.totalQuantity,
            'Total Pharmacies with Stock': analytics.medicines.totalPharmacies,
            topMedicines: analytics.medicines.topMedicines,
        },
        hospitals: {
            'Total Hospitals': analytics.hospitals.totalHospitals,
            'Total Beds': analytics.hospitals.totalBeds,
            'Total Occupied Beds': analytics.hospitals.totalOccupiedBeds,
            'Total Available Beds': analytics.hospitals.totalAvailableBeds,
            bySpecialization: analytics.hospitals.bySpecialization,
        },
        pharmacies: {
            'Total Pharmacies': analytics.pharmacies.totalPharmacies,
            'Total 24x7 Pharmacies': analytics.pharmacies.total24x7Pharmacies,
            'Total Medicines Available': analytics.pharmacies.totalMedicinesAvailable,
        },
        users: {
            'Total Users': analytics.users.totalUsers,
            'Total Visitors': analytics.users.totalVisitors,
            'New Users This Month': analytics.users.newUsersThisMonth,
            'Active Users': analytics.users.activeUsers,
        },
        engagement: {
            'Total Appointments': analytics.engagement.totalAppointments,
            'Total Searches': analytics.engagement.totalSearches,
            'Total Reviews': analytics.engagement.totalReviews,
            'Average Rating': analytics.engagement.averageRating,
        },
    };

    return res.status(statusCode.OK).json(
        new ApiResponse(
            statusCode.OK,
            `Analytics retrieved successfully for pincode ${pinCode}`,
            responseData
        )
    );
});

const getAllAnalytics = asyncHandler(async (req, res) => {
    // Get total counts from respective models (global counts)
    const [totalUsers, totalHospitals, totalPharmacies, allAnalytics] = await Promise.all([
        User.countDocuments(),
        Hospital.countDocuments(),
        Pharmacy.countDocuments(),
        Analytics.find()
    ]);


    const aggregatedData = allAnalytics.reduce((acc, analytics) => {
        // Blood Bank
        acc.bloodBank.totalDonations += analytics.bloodBank.totalDonations;
        acc.bloodBank.totalRequests += analytics.bloodBank.totalRequests;
        acc.bloodBank.totalFulfilled += analytics.bloodBank.totalFulfilled;

        Object.keys(analytics.bloodBank.byBloodGroup).forEach(bloodType => {
            acc.bloodBank.byBloodGroup[bloodType].donated += analytics.bloodBank.byBloodGroup[bloodType].donated;
            acc.bloodBank.byBloodGroup[bloodType].received += analytics.bloodBank.byBloodGroup[bloodType].received;
        });

        // Organ Donation
        acc.organDonation.totalRegistrations += analytics.organDonation.totalRegistrations;
        acc.organDonation.totalDonated += analytics.organDonation.totalDonated;
        acc.organDonation.totalRequests += analytics.organDonation.totalRequests;

        Object.keys(analytics.organDonation.byOrganType).forEach(organType => {
            acc.organDonation.byOrganType[organType].registered += analytics.organDonation.byOrganType[organType].registered;
            acc.organDonation.byOrganType[organType].donated += analytics.organDonation.byOrganType[organType].donated;
        });

        acc.organDonation.byConsentType.Living += analytics.organDonation.byConsentType.Living;
        acc.organDonation.byConsentType.Posthumous += analytics.organDonation.byConsentType.Posthumous;

        // Emergency Services
        acc.emergencyServices.totalEmergencies += analytics.emergencyServices.totalEmergencies;
        acc.emergencyServices.totalAmbulanceCalls += analytics.emergencyServices.totalAmbulanceCalls;
        acc.emergencyServices.totalResolved += analytics.emergencyServices.totalResolved;
        acc.emergencyServices.totalPending += analytics.emergencyServices.totalPending;
        acc.emergencyServices.totalResponseTime += analytics.emergencyServices.averageResponseTime;
        acc.emergencyServices.count += 1;

        Object.keys(analytics.emergencyServices.byStatus).forEach(status => {
            acc.emergencyServices.byStatus[status] += analytics.emergencyServices.byStatus[status];
        });

        // Medicines
        acc.medicines.totalMedicines += analytics.medicines.totalMedicines;
        acc.medicines.totalQuantity += analytics.medicines.totalQuantity;
        acc.medicines.totalPharmacies += analytics.medicines.totalPharmacies;

        // Hospitals
        acc.hospitals.totalHospitals += analytics.hospitals.totalHospitals;
        acc.hospitals.totalBeds += analytics.hospitals.totalBeds;
        acc.hospitals.totalOccupiedBeds += analytics.hospitals.totalOccupiedBeds;
        acc.hospitals.totalAvailableBeds += analytics.hospitals.totalAvailableBeds;

        Object.keys(analytics.hospitals.bySpecialization).forEach(specialization => {
            acc.hospitals.bySpecialization[specialization] += analytics.hospitals.bySpecialization[specialization];
        });

        // Pharmacies
        acc.pharmacies.totalPharmacies += analytics.pharmacies.totalPharmacies;
        acc.pharmacies.total24x7Pharmacies += analytics.pharmacies.total24x7Pharmacies;
        acc.pharmacies.totalMedicinesAvailable += analytics.pharmacies.totalMedicinesAvailable;

        // Users
        acc.users.totalUsers += analytics.users.totalUsers;
        acc.users.totalVisitors += analytics.users.totalVisitors;
        acc.users.newUsersThisMonth += analytics.users.newUsersThisMonth;
        acc.users.activeUsers += analytics.users.activeUsers;

        // Engagement
        acc.engagement.totalAppointments += analytics.engagement.totalAppointments;
        acc.engagement.totalSearches += analytics.engagement.totalSearches;
        acc.engagement.totalReviews += analytics.engagement.totalReviews;
        acc.engagement.totalRatingSum += analytics.engagement.averageRating * analytics.engagement.totalReviews;
        acc.engagement.reviewCount += analytics.engagement.totalReviews;

        return acc;
    }, {
        bloodBank: {
            totalDonations: 0,
            totalRequests: 0,
            totalFulfilled: 0,
            byBloodGroup: {
                'A+': { donated: 0, received: 0 },
                'A-': { donated: 0, received: 0 },
                'B+': { donated: 0, received: 0 },
                'B-': { donated: 0, received: 0 },
                'AB+': { donated: 0, received: 0 },
                'AB-': { donated: 0, received: 0 },
                'O+': { donated: 0, received: 0 },
                'O-': { donated: 0, received: 0 },
            }
        },
        organDonation: {
            totalRegistrations: 0,
            totalDonated: 0,
            totalRequests: 0,
            byOrganType: {
                Heart: { registered: 0, donated: 0 },
                Kidney: { registered: 0, donated: 0 },
                Liver: { registered: 0, donated: 0 },
                Lung: { registered: 0, donated: 0 },
                Pancreas: { registered: 0, donated: 0 },
                Cornea: { registered: 0, donated: 0 },
                Intestine: { registered: 0, donated: 0 },
                'Bone Marrow': { registered: 0, donated: 0 },
                Skin: { registered: 0, donated: 0 },
                Other: { registered: 0, donated: 0 },
            },
            byConsentType: {
                Living: 0,
                Posthumous: 0,
            }
        },
        emergencyServices: {
            totalEmergencies: 0,
            totalAmbulanceCalls: 0,
            totalResolved: 0,
            totalPending: 0,
            totalResponseTime: 0,
            count: 0,
            byStatus: {
                pending: 0,
                responding: 0,
                resolved: 0,
                cancelled: 0,
            }
        },
        medicines: {
            totalMedicines: 0,
            totalQuantity: 0,
            totalPharmacies: 0,
        },
        hospitals: {
            totalHospitals: 0,
            totalBeds: 0,
            totalOccupiedBeds: 0,
            totalAvailableBeds: 0,
            bySpecialization: {
                General: 0,
                Cardiology: 0,
                Neurology: 0,
                Orthopedics: 0,
                Pediatrics: 0,
                Oncology: 0,
                Other: 0,
            }
        },
        pharmacies: {
            totalPharmacies: 0,
            total24x7Pharmacies: 0,
            totalMedicinesAvailable: 0,
        },
        users: {
            totalUsers: 0,
            totalVisitors: 0,
            newUsersThisMonth: 0,
            activeUsers: 0,
        },
        engagement: {
            totalAppointments: 0,
            totalSearches: 0,
            totalReviews: 0,
            totalRatingSum: 0,
            reviewCount: 0,
        }
    });

    // Calculate average response time and average rating
    const averageResponseTime = aggregatedData.emergencyServices.count > 0
        ? aggregatedData.emergencyServices.totalResponseTime / aggregatedData.emergencyServices.count
        : 0;

    const averageRating = aggregatedData.engagement.reviewCount > 0
        ? aggregatedData.engagement.totalRatingSum / aggregatedData.engagement.reviewCount
        : 0;

    const totalLivesImpacted =
        aggregatedData.bloodBank.totalDonations +
        aggregatedData.emergencyServices.totalAmbulanceCalls +
        aggregatedData.emergencyServices.totalResolved;

    // Prepare response data with headings and numbers
    const responseData = {
        overview: {
            'Total Users': totalUsers,
            'Total Hospitals': totalHospitals,
            'Total Pharmacies': totalPharmacies,
            'Total Pincodes Tracked': allAnalytics.length,
            'Total Lives Impacted': totalLivesImpacted
        },
        bloodBank: {
            'Total Blood Donations': aggregatedData.bloodBank.totalDonations,
            'Total Blood Requests': aggregatedData.bloodBank.totalRequests,
            'Total Requests Fulfilled': aggregatedData.bloodBank.totalFulfilled,
            byBloodGroup: aggregatedData.bloodBank.byBloodGroup,
        },
        organDonation: {
            'Total Organ Registrations': aggregatedData.organDonation.totalRegistrations,
            'Total Organs Donated': aggregatedData.organDonation.totalDonated,
            'Total Organ Requests': aggregatedData.organDonation.totalRequests,
            byOrganType: aggregatedData.organDonation.byOrganType,
            byConsentType: {
                'Living Donations': aggregatedData.organDonation.byConsentType.Living,
                'Posthumous Donations': aggregatedData.organDonation.byConsentType.Posthumous,
            },
        },
        emergencyServices: {
            'Total Emergencies': aggregatedData.emergencyServices.totalEmergencies,
            'Total Ambulance Calls': aggregatedData.emergencyServices.totalAmbulanceCalls,
            'Total Resolved': aggregatedData.emergencyServices.totalResolved,
            'Total Pending': aggregatedData.emergencyServices.totalPending,
            'Average Response Time (minutes)': parseFloat(averageResponseTime.toFixed(2)),
            byStatus: aggregatedData.emergencyServices.byStatus,
        },
        medicines: {
            'Total Medicines': aggregatedData.medicines.totalMedicines,
            'Total Quantity': aggregatedData.medicines.totalQuantity,
            'Total Pharmacies with Stock': aggregatedData.medicines.totalPharmacies,
        },
        hospitals: {
            'Total Hospitals': aggregatedData.hospitals.totalHospitals,
            'Total Beds': aggregatedData.hospitals.totalBeds,
            'Total Occupied Beds': aggregatedData.hospitals.totalOccupiedBeds,
            'Total Available Beds': aggregatedData.hospitals.totalAvailableBeds,
            bySpecialization: aggregatedData.hospitals.bySpecialization,
        },
        pharmacies: {
            'Total Pharmacies': aggregatedData.pharmacies.totalPharmacies,
            'Total 24x7 Pharmacies': aggregatedData.pharmacies.total24x7Pharmacies,
            'Total Medicines Available': aggregatedData.pharmacies.totalMedicinesAvailable,
        },
        users: {
            'Total Users': aggregatedData.users.totalUsers,
            'Total Visitors': aggregatedData.users.totalVisitors,
            'New Users This Month': aggregatedData.users.newUsersThisMonth,
            'Active Users': aggregatedData.users.activeUsers,
        },
        engagement: {
            'Total Appointments': aggregatedData.engagement.totalAppointments,
            'Total Searches': aggregatedData.engagement.totalSearches,
            'Total Reviews': aggregatedData.engagement.totalReviews,
            'Average Rating': parseFloat(averageRating.toFixed(2)),
        },
    };

    return res.status(statusCode.OK).json(
        new ApiResponse(
            statusCode.OK,
            'Global analytics retrieved successfully',
            responseData
        )
    );
});

export { getAnalyticsByPincode, getAllAnalytics };