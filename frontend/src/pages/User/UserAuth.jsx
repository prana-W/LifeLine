import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Phone, Lock, MapPin, Heart } from "lucide-react";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

export default function UserAuth() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const [loginForm, setLoginForm] = useState({
        phoneNumber: "",
        password: "",
    });

    const [signupForm, setSignupForm] = useState({
        name: "",
        phoneNumber: "",
        pinCode: "",
        location: "",
        bloodType: "",
        password: "",
        confirmPassword: "",
    });

    const bloodGroups = [
        "A+","A-","B+","B-","AB+","AB-","O+","O-"
    ];

    // ---------------- LOGIN ----------------
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/user/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(loginForm),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(data?.message);
                localStorage.setItem("role", "user");
                setMessage({ type: "success", text: data.message });
                window.location.href = "/";
            } else {
                setMessage({ type: "error", text: data.message || "Login failed!" });
            }
        } catch {
            setMessage({ type: "error", text: "Network error. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    // ---------------- SIGNUP ----------------
    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        if (signupForm.password !== signupForm.confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match!" });
            return;
        }

        if (!signupForm.bloodType) {
            setMessage({ type: "error", text: "Please select your blood type!" });
            return;
        }

        setLoading(true);
        const { confirmPassword, ...signupData } = signupForm;

        try {
            const res = await fetch(`${API_BASE_URL}/user/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(signupData),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: "success", text: data.message });
                toast.success(data.message);
                setTimeout(() => setIsLogin(true), 2000);
            } else {
                setMessage({ type: "error", text: data.message || "Registration failed!" });
            }
        } catch {
            setMessage({ type: "error", text: "Network error. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            
            {/* Animated Grid Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="animate-pulse-slow">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(155, 89, 182, 0.15)" strokeWidth="2"/>
                        </pattern>
                        <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="rgba(155, 89, 182, 0.2)" />
                            <stop offset="100%" stopColor="rgba(74, 144, 226, 0.2)" />
                        </linearGradient>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
                
                {/* Animated Gradient Orbs */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-20 animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${5 + Math.random() * 10}s`
                        }}
                    ></div>
                ))}
            </div>

            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
                    10% { opacity: 0.3; }
                    90% { opacity: 0.3; }
                    50% { transform: translateY(-100vh) translateX(50px); }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 0.8; }
                }
                @keyframes gradient-shift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes heartbeat {
                    0%, 100% { transform: scale(1); }
                    10%, 30% { transform: scale(1.1); }
                    20%, 40% { transform: scale(1); }
                }
                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes glow {
                    0%, 100% { box-shadow: 0 0 20px rgba(155, 89, 182, 0.3); }
                    50% { box-shadow: 0 0 40px rgba(155, 89, 182, 0.6), 0 0 60px rgba(155, 89, 182, 0.4); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                .animate-float {
                    animation: float linear infinite;
                }
                .animate-pulse-slow {
                    animation: pulse-slow 4s ease-in-out infinite;
                }
                .animate-heartbeat {
                    animation: heartbeat 1.5s ease-in-out infinite;
                }
                .animate-slideInUp {
                    animation: slideInUp 0.6s ease-out forwards;
                }
                .animate-glow {
                    animation: glow 2s ease-in-out infinite;
                }
                .group:hover .group-hover-glow {
                    box-shadow: 0 0 30px rgba(155, 89, 182, 0.4);
                }
                .input-focus:focus {
                    transform: scale(1.02);
                    transition: all 0.3s ease;
                }
            `}</style>

            <Card className="w-full max-w-2xl shadow-2xl border-2 border-purple-100 bg-white/95 backdrop-blur-sm transition-all duration-500 hover:shadow-purple-200/50 hover:shadow-3xl relative z-10 animate-slideInUp">
                {/* Animated Border Gradient */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
                
                <CardHeader className="space-y-3 pb-6">
                    <div className="flex items-center justify-center mb-2">
                        <div className="p-4 rounded-full transition-all duration-500 hover:scale-110 animate-heartbeat bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 shadow-lg hover:shadow-purple-500/50">
                            <Heart className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl text-center font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {isLogin ? "User Login" : "User Registration"}
                    </CardTitle>
                    <CardDescription className="text-center text-base text-gray-600">
                        {isLogin ? "Access your personal health dashboard" : "Create your user account"}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {message.text && (
                        <Alert className={`mb-6 border-none animate-slideInUp ${message.type === "success" ? "bg-green-50 shadow-lg shadow-green-100" : "bg-red-50 shadow-lg shadow-red-100"}`}>
                            <AlertDescription className={`font-medium ${message.type === "success" ? "text-green-700" : "text-red-700"}`}>
                                {message.text}
                            </AlertDescription>
                        </Alert>
                    )}

                    {isLogin ? (
                        // ------------------- LOGIN --------------------
                        <div className="space-y-5">

                            {/* Phone */}
                            <div className="space-y-2 animate-slideInUp" style={{ animationDelay: '0.1s' }}>
                                <Label className="text-sm font-semibold text-gray-700">Phone Number</Label>
                                <div className="relative group">
                                    <Phone className="absolute left-3 top-3 h-5 w-5 text-purple-500 transition-all duration-300 group-hover:scale-110 group-hover:text-pink-500" />
                                    <Input
                                        placeholder="Enter phone number"
                                        className="pl-10 py-6 border-gray-200 input-focus transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                                        value={loginForm.phoneNumber}
                                        onChange={(e) =>
                                            setLoginForm((prev) => ({ ...prev, phoneNumber: e.target.value }))
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
                                <Label className="text-sm font-semibold text-gray-700">Password</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-purple-500 transition-all duration-300 group-hover:scale-110 group-hover:text-pink-500" />
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 py-6 border-gray-200 input-focus transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                                        value={loginForm.password}
                                        onChange={(e) =>
                                            setLoginForm((prev) => ({ ...prev, password: e.target.value }))
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleLoginSubmit}
                                className="w-full py-6 text-white font-semibold bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-slideInUp shadow-lg"
                                style={{ animationDelay: '0.3s' }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Logging in...
                                    </span>
                                ) : "Login"}
                            </Button>
                        </div>
                    ) : (
                        // ---------------- SIGNUP -------------------
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* Name */}
                                <div className="space-y-2 animate-slideInUp" style={{ animationDelay: '0.1s' }}>
                                    <Label className="text-sm font-semibold text-gray-700">Full Name *</Label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-3 h-5 w-5 text-purple-500 transition-all duration-300 group-hover:scale-110 group-hover:text-pink-500" />
                                        <Input
                                            placeholder="John Doe"
                                            className="pl-10 py-6 border-gray-200 input-focus transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                                            value={signupForm.name}
                                            onChange={(e) =>
                                                setSignupForm((prev) => ({ ...prev, name: e.target.value }))
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="space-y-2 animate-slideInUp" style={{ animationDelay: '0.15s' }}>
                                    <Label className="text-sm font-semibold text-gray-700">Phone Number *</Label>
                                    <div className="relative group">
                                        <Phone className="absolute left-3 top-3 h-5 w-5 text-purple-500 transition-all duration-300 group-hover:scale-110 group-hover:text-pink-500" />
                                        <Input
                                            placeholder="9876543210"
                                            className="pl-10 py-6 border-gray-200 input-focus transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                                            value={signupForm.phoneNumber}
                                            onChange={(e) =>
                                                setSignupForm((prev) => ({ ...prev, phoneNumber: e.target.value }))
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                {/* PinCode */}
                                <div className="space-y-2 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
                                    <Label className="text-sm font-semibold text-gray-700">Pin Code *</Label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-purple-500 transition-all duration-300 group-hover:scale-110 group-hover:text-pink-500" />
                                        <Input
                                            placeholder="110045"
                                            className="pl-10 py-6 border-gray-200 input-focus transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                                            value={signupForm.pinCode}
                                            onChange={(e) =>
                                                setSignupForm((prev) => ({ ...prev, pinCode: e.target.value }))
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="space-y-2 animate-slideInUp" style={{ animationDelay: '0.25s' }}>
                                    <Label className="text-sm font-semibold text-gray-700">Location (optional)</Label>
                                    <Input
                                        placeholder="Street, Area, City"
                                        className="py-6 border-gray-200 input-focus transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                                        value={signupForm.location}
                                        onChange={(e) =>
                                            setSignupForm((prev) => ({ ...prev, location: e.target.value }))
                                        }
                                    />
                                </div>

                                {/* Blood Type */}
                                <div className="space-y-2 md:col-span-2 animate-slideInUp" style={{ animationDelay: '0.3s' }}>
                                    <Label className="text-sm font-semibold text-gray-700">Blood Type *</Label>
                                    <select
                                        className="w-full py-3 px-4 border border-gray-300 rounded-lg bg-white input-focus transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                                        value={signupForm.bloodType}
                                        onChange={(e) =>
                                            setSignupForm((prev) => ({ ...prev, bloodType: e.target.value }))
                                        }
                                        required
                                    >
                                        <option value="" disabled>Select your blood group</option>
                                        {bloodGroups.map((bg) => (
                                            <option key={bg} value={bg}>{bg}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Password */}
                                <div className="space-y-2 animate-slideInUp" style={{ animationDelay: '0.35s' }}>
                                    <Label className="text-sm font-semibold text-gray-700">Password *</Label>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-purple-500 transition-all duration-300 group-hover:scale-110 group-hover:text-pink-500" />
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10 py-6 border-gray-200 input-focus transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                                            value={signupForm.password}
                                            onChange={(e) =>
                                                setSignupForm((prev) => ({ ...prev, password: e.target.value }))
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2 animate-slideInUp" style={{ animationDelay: '0.4s' }}>
                                    <Label className="text-sm font-semibold text-gray-700">Confirm Password *</Label>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-purple-500 transition-all duration-300 group-hover:scale-110 group-hover:text-pink-500" />
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10 py-6 border-gray-200 input-focus transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                                            value={signupForm.confirmPassword}
                                            onChange={(e) =>
                                                setSignupForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleSignupSubmit}
                                className="w-full py-6 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white font-semibold hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-slideInUp shadow-lg"
                                style={{ animationDelay: '0.45s' }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Account...
                                    </span>
                                ) : "Create Account"}
                            </Button>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex flex-col space-y-3 pt-6">
                    <div className="text-sm text-center text-gray-600">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            className="font-semibold hover:underline bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent transition-all duration-300 hover:scale-105 inline-block"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setMessage({ type: "", text: "" });
                            }}
                        >
                            {isLogin ? "Sign up" : "Login"}
                        </button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}