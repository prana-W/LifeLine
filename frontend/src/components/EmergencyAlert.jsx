import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Loader2, MapPin, Video, Clock, Phone, VolumeX, Shield, Zap } from 'lucide-react';
import { toast } from 'sonner';
import useApi from '../hooks/useApi.js';

export default function EmergencyAlertCard() {
    const api = useApi();
    const [isRecording, setIsRecording] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [countdown, setCountdown] = useState(10);
    const [isProcessing, setIsProcessing] = useState(false);

    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);
    const alarmAudioRef = useRef(null);
    const alarmTimeoutRef = useRef(null);

    // 🔊 ALARM SOUND GENERATION
    const generateAlarmSound = () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const duration = 0.3;
        const frequency1 = 800;
        const frequency2 = 1000;

        const createBeep = (frequency, startTime) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        };

        let time = audioContext.currentTime;
        for (let i = 0; i < 50; i++) {
            createBeep(i % 2 === 0 ? frequency1 : frequency2, time);
            time += duration + 0.3;
        }

        return audioContext;
    };

    const startAlarm = () => {
        const audioContext = generateAlarmSound();
        alarmAudioRef.current = audioContext;

        alarmTimeoutRef.current = setTimeout(() => {
            stopAlarm();
        }, 5 * 60 * 1000);
    };

    const stopAlarm = () => {
        if (alarmAudioRef.current) {
            alarmAudioRef.current.close();
            alarmAudioRef.current = null;
        }
        if (alarmTimeoutRef.current) {
            clearTimeout(alarmTimeoutRef.current);
            alarmTimeoutRef.current = null;
        }
    };

    // 📍 LOCATION FETCHING
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

    // 🎥 RECORDING HANDLERS
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 640 }, height: { ideal: 480 } },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            });

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp8,opus',
                videoBitsPerSecond: 250000,
                audioBitsPerSecond: 128000
            });

            recordedChunksRef.current = [];
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) recordedChunksRef.current.push(event.data);
            };

            mediaRecorder.start();
            mediaRecorderRef.current = mediaRecorder;
            return stream;
        } catch (err) {
            throw new Error('Failed to start recording: ' + err.message);
        }
    };

    const stopRecording = () => {
        return new Promise((resolve) => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.onstop = () => {
                    const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });

                    if (mediaRecorderRef.current.stream) {
                        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
                    }

                    resolve(blob);
                };

                mediaRecorderRef.current.stop();
            } else {
                resolve(null);
            }
        });
    };

    // 🚨 MAIN EMERGENCY HANDLER
    const handleEmergency = async () => {
        setIsProcessing(true);
        setShowPopup(true);
        setCountdown(10);

        try {
            const locationData = await getLocationData();

            await startRecording();
            setIsRecording(true);

            let timeLeft = 10;
            const countdownInterval = setInterval(() => {
                timeLeft--;
                setCountdown(timeLeft);
                if (timeLeft === 0) clearInterval(countdownInterval);
            }, 1000);

            await new Promise((resolve) => setTimeout(resolve, 10000));

            const recordingBlob = await stopRecording();
            setIsRecording(false);

            if (!recordingBlob) {
                throw new Error('Failed to get recording');
            }

            const formData = new FormData();
            formData.append('audioVideo', recordingBlob, 'emergency.webm');
            formData.append('pincode', locationData.pincode);
            formData.append('latitude', locationData.latitude.toString());
            formData.append('longitude', locationData.longitude.toString());
            formData.append('location', locationData.fullAddress);
            formData.append('city', locationData.city);
            formData.append('state', locationData.state);
            formData.append('timestamp', new Date().toISOString());

            const { success, data, message } = await api.post('/user/emergency', formData);

            if (success) {
                toast.success(message || 'Emergency alert sent successfully!');
                startAlarm();
            } else {
                toast.error(message || 'Failed to send emergency alert.');
            }
        } catch (error) {
            console.error('Emergency alert error:', error);
            toast.error(error.message || 'Failed to send emergency alert.');

            if (isRecording) {
                await stopRecording();
                setIsRecording(false);
            }
        } finally {
            setIsProcessing(false);
            setShowPopup(false);
        }
    };

    const handleCancelEmergency = async () => {
        if (isRecording) {
            await stopRecording();
            setIsRecording(false);
        }
        setShowPopup(false);
        setIsProcessing(false);
        toast.info('Emergency alert cancelled');
    };

    const handleDisableAlarm = () => {
        stopAlarm();
        toast.info('Alarm disabled');
    };

    useEffect(() => {
        return () => {
            stopAlarm();
            if (isRecording) stopRecording();
        };
    }, []);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/30 shadow-2xl overflow-hidden group"
            >
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-orange-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Decorative Elements */}
                <motion.div
                    className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-0 left-0 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl"
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
                                className="p-3 bg-red-500/20 backdrop-blur-sm rounded-2xl border border-red-400/30"
                            >
                                <AlertTriangle className="w-8 h-8 text-red-200" />
                            </motion.div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">Emergency</h3>
                                <p className="text-sm text-red-200">Critical Alert</p>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className="px-3 py-1 bg-red-500/20 backdrop-blur-sm rounded-full border border-red-400/30 flex items-center gap-2">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="w-2 h-2 bg-red-400 rounded-full"
                            />
                            <span className="text-xs text-red-200 font-semibold">Live Recording</span>
                        </div>
                    </div>

                    {/* Info Cards */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                            <MapPin className="w-4 h-4 text-red-300 mb-1" />
                            <p className="text-xs text-white/80">GPS</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                            <Video className="w-4 h-4 text-red-300 mb-1" />
                            <p className="text-xs text-white/80">10sec</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                            <Phone className="w-4 h-4 text-red-300 mb-1" />
                            <p className="text-xs text-white/80">Alert</p>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-white/80 text-sm mb-6 leading-relaxed">
                        Activate emergency protocol. Your location and 10-second recording will be sent to nearby hospitals with an audible alarm.
                    </p>

                    {/* Emergency Button */}
                    <motion.button
                        whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                        whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                        onClick={handleEmergency}
                        disabled={isProcessing}
                        className="relative w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-red-400 disabled:to-orange-400 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-xl disabled:cursor-not-allowed overflow-hidden group/btn"
                    >
                        {/* Button shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                        
                        <span className="relative flex items-center justify-center gap-3 text-lg">
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Processing Emergency...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-6 h-6" />
                                    EMERGENCY ALERT
                                    <Zap className="w-6 h-6" />
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

                    {/* Alarm Disable Button */}
                    <AnimatePresence>
                        {alarmAudioRef.current && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                onClick={handleDisableAlarm}
                                className="w-full mt-3 bg-yellow-500/20 backdrop-blur-sm hover:bg-yellow-500/30 border border-yellow-400/30 text-yellow-200 font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <VolumeX className="w-5 h-5" />
                                Disable Alarm
                            </motion.button>
                        )}
                    </AnimatePresence>

                    {/* Footer Info */}
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/60">
                        <Shield className="w-3 h-3" />
                        <span>Sends location, video & audio to emergency services</span>
                    </div>
                </div>

                {/* Corner Decoration */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-400/20 to-transparent rounded-bl-full" />
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-orange-400/20 to-transparent rounded-tr-full" />

                {/* Border Glow Effect */}
                <motion.div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        boxShadow: "0 0 30px rgba(239, 68, 68, 0.3), inset 0 0 30px rgba(239, 68, 68, 0.1)"
                    }}
                />
            </motion.div>

            {/* Emergency Popup Modal */}
            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-gradient-to-br from-red-900/90 to-orange-900/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full border-2 border-red-400/30"
                        >
                            {/* Modal Header */}
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center gap-4">
                                    <motion.div
                                        animate={{ 
                                            rotate: [0, 10, -10, 0],
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{ duration: 0.5, repeat: Infinity }}
                                        className="w-14 h-14 bg-red-500/30 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-red-400/50"
                                    >
                                        <AlertTriangle className="w-7 h-7 text-red-300" />
                                    </motion.div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Emergency Active</h2>
                                        <p className="text-sm text-red-200">Recording in progress</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCancelEmergency}
                                    className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Countdown Display */}
                            <div className="text-center mb-8">
                                <motion.div
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                    className="inline-flex items-center justify-center w-40 h-40 bg-gradient-to-br from-red-500/30 to-orange-500/30 backdrop-blur-sm rounded-full mb-4 border-4 border-red-400/30 relative"
                                >
                                    <span className="text-7xl font-bold text-white drop-shadow-lg">{countdown}</span>
                                    
                                    {/* Rotating border effect */}
                                    <motion.div
                                        className="absolute inset-0 rounded-full border-t-4 border-red-400"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    />
                                </motion.div>

                                <div className="space-y-2">
                                    <p className="text-white font-semibold text-lg">
                                        {isRecording ? '🎥 Recording Evidence' : '⏳ Preparing...'}
                                    </p>
                                    <div className="flex items-center justify-center gap-2 text-red-200 text-sm">
                                        <Clock className="w-4 h-4" />
                                        <span>Alert sending in {countdown} seconds</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status Indicators */}
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                                    <motion.div
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <MapPin className="w-5 h-5 text-green-400" />
                                    </motion.div>
                                    <span className="text-white text-sm">Location acquired</span>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                                    <motion.div
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                                    >
                                        <Video className="w-5 h-5 text-blue-400" />
                                    </motion.div>
                                    <span className="text-white text-sm">
                                        {isRecording ? 'Recording active' : 'Preparing camera'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                                    <motion.div
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                                    >
                                        <Phone className="w-5 h-5 text-purple-400" />
                                    </motion.div>
                                    <span className="text-white text-sm">Connecting to emergency services</span>
                                </div>
                            </div>

                            {/* Cancel Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleCancelEmergency}
                                className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold py-4 px-6 rounded-xl transition-all"
                            >
                                Cancel Emergency Alert
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}