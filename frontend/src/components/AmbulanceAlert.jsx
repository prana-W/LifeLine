import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ambulance, Loader2, MapPin, Phone, Clock, Navigation } from 'lucide-react';
import { toast } from 'sonner';
import useApi from "@/hooks/useApi.js";

export default function AmbulanceAlertCard() {
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
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/30 shadow-2xl overflow-hidden group"
        >
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Decorative Elements */}
            <motion.div
                className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/20 rounded-full blur-2xl"
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity }}
            />

            {/* Dotted Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className="h-full w-full"
                    style={{
                        backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                    }}
                />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <motion.div
                            animate={{ 
                                rotate: [0, -10, 10, -10, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="p-3 bg-blue-500/20 backdrop-blur-sm rounded-2xl border border-blue-400/30"
                        >
                            <Ambulance className="w-8 h-8 text-blue-200" />
                        </motion.div>
                        <div>
                            <h3 className="text-2xl font-bold text-white">Ambulance</h3>
                            <p className="text-sm text-blue-200">Emergency Transport</p>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="px-3 py-1 bg-green-500/20 backdrop-blur-sm rounded-full border border-green-400/30 flex items-center gap-2">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-2 h-2 bg-green-400 rounded-full"
                        />
                        <span className="text-xs text-green-200 font-semibold">Available 24/7</span>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                        <MapPin className="w-4 h-4 text-blue-300 mb-1" />
                        <p className="text-xs text-white/80">GPS</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                        <Clock className="w-4 h-4 text-blue-300 mb-1" />
                        <p className="text-xs text-white/80">Fast</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                        <Phone className="w-4 h-4 text-blue-300 mb-1" />
                        <p className="text-xs text-white/80">Alert</p>
                    </div>
                </div>

                {/* Description */}
                <p className="text-white/80 text-sm mb-6 leading-relaxed">
                    Request immediate ambulance assistance. Your location will be automatically detected and shared with nearby hospitals.
                </p>

                {/* Call Button */}
                <motion.button
                    whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                    whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                    onClick={handleCallAmbulance}
                    disabled={isProcessing}
                    className="relative w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:from-blue-400 disabled:to-cyan-500 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-xl disabled:cursor-not-allowed overflow-hidden group/btn"
                >
                    {/* Button shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                    
                    <span className="relative flex items-center justify-center gap-3 text-lg">
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Calling Ambulance...
                            </>
                        ) : (
                            <>
                                <Navigation className="w-6 h-6" />
                                Call Ambulance Now
                                <Navigation className="w-6 h-6 rotate-180" />
                            </>
                        )}
                    </span>

                    {/* Pulsing border effect */}
                    {!isProcessing && (
                        <motion.div
                            className="absolute inset-0 border-2 border-white/30 rounded-2xl"
                            animate={{ 
                                scale: [1, 1.05, 1],
                                opacity: [0.5, 0, 0.5]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    )}
                </motion.button>

                {/* Footer Info */}
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/60">
                    <Clock className="w-3 h-3" />
                    <span>Average response time: {'<'}5 minutes</span>
                </div>
            </div>

            {/* Corner Decoration */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-cyan-400/20 to-transparent rounded-tr-full" />

            {/* Border Glow Effect */}
            <motion.div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    boxShadow: "0 0 30px rgba(59, 130, 246, 0.3), inset 0 0 30px rgba(59, 130, 246, 0.1)"
                }}
            />
        </motion.div>
    );
}