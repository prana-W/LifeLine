import React, { useState } from 'react';
import { Ambulance, Loader2, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function CallAmbulanceButton() {
    const [isProcessing, setIsProcessing] = useState(false);

    const getAuthToken = () => {
        return localStorage.getItem('authToken') || '';
    };

    const getLocationData = async () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
                            {
                                headers: {
                                    'User-Agent': 'EmergencyAlert/1.0'
                                }
                            }
                        );

                        const data = await response.json();

                        resolve({
                            latitude: latitude,
                            longitude: longitude,
                            pincode: data.address?.postcode || 'Unknown',
                            city: data.address?.city || data.address?.town || data.address?.village || 'Unknown',
                            state: data.address?.state || 'Unknown',
                            fullAddress: data.display_name
                        });
                    } catch (err) {
                        reject(new Error('Failed to fetch location details'));
                    }
                },
                (err) => {
                    reject(new Error('Failed to get location'));
                }
            );
        });
    };

    const handleCallAmbulance = async () => {
        setIsProcessing(true);

        try {
            // Get location data
            toast.info('Getting your location...');
            const locationData = await getLocationData();

            // Send ambulance request
            const token = getAuthToken();

            const response = await fetch('/api/v1/user/ambulance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    pincode: locationData.pincode,
                    latitude: locationData.latitude,
                    longitude: locationData.longitude,
                    location: locationData.fullAddress,
                    city: locationData.city,
                    state: locationData.state
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                toast.success(result.message || 'Ambulance has been called!');

                // Show additional info if hospitals were notified
                if (result.data.hospitalsNotified && result.data.hospitalsCount > 0) {
                    toast.info(`${result.data.hospitalsCount} hospital(s) notified in your area`);
                }
            } else {
                toast.error(result.message || 'Failed to call ambulance');
            }

        } catch (error) {
            console.error('Ambulance call error:', error);
            toast.error(error.message || 'Failed to call ambulance');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <button
            onClick={handleCallAmbulance}
            disabled={isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-6 px-8 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg disabled:transform-none text-xl flex items-center justify-center gap-3"
        >
            {isProcessing ? (
                <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Calling Ambulance...
                </>
            ) : (
                <>
                    <Ambulance className="w-6 h-6" />
                    🚑 Call Ambulance
                </>
            )}
        </button>
    );
}