import React, { useState, useRef, useEffect } from 'react';
import { AlertTriangle, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import useApi from '../hooks/useApi.js';

export default function EmergencyAlert() {
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

        // Auto-stop after 5 minutes
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
                    console.log('🎬 Video size:', (blob.size / 1024 / 1024).toFixed(2), 'MB');

                    // Stop all tracks
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

            // ✅ Prepare FormData
            const formData = new FormData();
            formData.append('audioVideo', recordingBlob, 'emergency.webm');
            formData.append('pincode', locationData.pincode);
            formData.append('latitude', locationData.latitude.toString());
            formData.append('longitude', locationData.longitude.toString());
            formData.append('location', locationData.fullAddress);
            formData.append('city', locationData.city);
            formData.append('state', locationData.state);
            formData.append('timestamp', new Date().toISOString());

            console.log('🚨 Sending FormData to backend...');
            for (const [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

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
        <div className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4 animate-pulse">
                        <AlertTriangle className="w-10 h-10 text-red-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Emergency Alert</h1>
                    <p className="text-gray-600">Press the button below to activate emergency protocol</p>
                </div>

                <button
                    onClick={handleEmergency}
                    disabled={isProcessing}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-6 px-8 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg disabled:transform-none text-xl"
                >
                    {isProcessing ? (
                        <span className="flex items-center justify-center gap-3">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Processing...
                        </span>
                    ) : (
                        '🚨 EMERGENCY ALERT'
                    )}
                </button>

                {alarmAudioRef.current && (
                    <button
                        onClick={handleDisableAlarm}
                        className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                        🔇 Disable Alarm
                    </button>
                )}

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 leading-relaxed">
                        <strong>How it works:</strong> Clicking the emergency button will:
                        <br />• Get your current location
                        <br />• Record 10 seconds of audio/video
                        <br />• Send everything to emergency services
                        <br />• Sound an alarm until disabled
                    </p>
                </div>
            </div>

            {/* Emergency Popup */}
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Emergency Active</h2>
                                    <p className="text-sm text-gray-600">Recording in progress...</p>
                                </div>
                            </div>
                            <button
                                onClick={handleCancelEmergency}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-32 h-32 bg-red-50 rounded-full mb-4">
                                <span className="text-6xl font-bold text-red-600">{countdown}</span>
                            </div>
                            <p className="text-gray-700 font-medium">
                                {isRecording ? 'Recording audio and video...' : 'Preparing...'}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleCancelEmergency}
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                Cancel Emergency
                            </button>
                            <p className="text-xs text-center text-gray-500">
                                Emergency alert will be sent in {countdown} seconds
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
