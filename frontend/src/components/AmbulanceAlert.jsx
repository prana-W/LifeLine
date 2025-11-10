import React, { useState } from 'react';
import { Ambulance, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import useApi from "@/hooks/useApi.js";

export default function CallAmbulanceButton() {
    const [isProcessing, setIsProcessing] = useState(false);
    const api = useApi();

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
                            latitude,
                            longitude,
                            pincode: data.address?.postcode || 'Unknown',
                            city: data.address?.city || data.address?.town || data.address?.village || 'Unknown',
                            state: data.address?.state || 'Unknown',
                            fullAddress: data.display_name
                        });
                    } catch {
                        reject(new Error('Failed to fetch location details'));
                    }
                },
                () => reject(new Error('Failed to get location'))
            );
        });
    };

    const handleCallAmbulance = async () => {
        setIsProcessing(true);
        try {
            toast.info('Getting your location...');
            const locationData = await getLocationData();

            const { success, message } = await api.post('/user/ambulance', {
                pincode: locationData.pincode,
                latitude: locationData.latitude,
                longitude: locationData.longitude,
                location: locationData.fullAddress,
                city: locationData.city,
                state: locationData.state
            });

            if (success) {
                toast.success(message || 'Ambulance has been called!');
            } else {
                toast.error(message || 'Failed to call ambulance');
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
            className="
                w-full bg-white text-blue-600 border border-blue-300
                font-semibold py-5 px-8 rounded-xl
                hover:bg-blue-50 active:bg-blue-100
                disabled:opacity-60 disabled:cursor-not-allowed
                flex items-center justify-center gap-3
                transition-all duration-200
            "
        >
            {isProcessing ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Calling Ambulance...
                </>
            ) : (
                <>
                    <Ambulance className="w-5 h-5" />
                    Call Ambulance
                </>
            )}
        </button>
    );
}
