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
        <div className="min-h-screen relative flex items-center justify-center p-4 bg-[#F2F2F2]">
            
            {/* Grid Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="30" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(74, 144, 226, 0.1)" strokeWidth="1.5"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            <Card className="w-full max-w-2xl shadow-2xl border-none bg-white transition-all duration-300 hover:shadow-3xl relative z-10">
                <CardHeader className="space-y-3 pb-6">
                    <div className="flex items-center justify-center mb-2">
                        <div className="p-4 rounded-full transition-transform duration-300 hover:scale-110" style={{ backgroundColor: '#9b59b6' }}>
                            <Heart className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl text-center font-bold text-[#333]">
                        {isLogin ? "User Login" : "User Registration"}
                    </CardTitle>
                    <CardDescription className="text-center text-base text-[#333]/70">
                        {isLogin ? "Access your personal health dashboard" : "Create your user account"}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {message.text && (
                        <Alert className={`mb-6 border-none ${message.type === "success" ? "bg-green-50" : "bg-red-50"}`}>
                            <AlertDescription className={`font-medium ${message.type === "success" ? "text-green-700" : "text-red-700"}`}>
                                {message.text}
                            </AlertDescription>
                        </Alert>
                    )}

                    {isLogin ? (
                        // ------------------- LOGIN --------------------
                        <div className="space-y-5">

                            {/* Phone */}
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-[#333]">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-5 w-5 text-[#9b59b6]" />
                                    <Input
                                        placeholder="Enter phone number"
                                        className="pl-10 py-6 border-gray-200"
                                        value={loginForm.phoneNumber}
                                        onChange={(e) =>
                                            setLoginForm((prev) => ({ ...prev, phoneNumber: e.target.value }))
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-[#333]">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-[#9b59b6]" />
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 py-6 border-gray-200"
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
                                className="w-full py-6 text-white font-semibold bg-[#9b59b6] hover:opacity-90"
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </Button>
                        </div>
                    ) : (
                        // ---------------- SIGNUP -------------------
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* Name */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-[#333]">Full Name *</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-5 w-5 text-[#9b59b6]" />
                                        <Input
                                            placeholder="John Doe"
                                            className="pl-10 py-6 border-gray-200"
                                            value={signupForm.name}
                                            onChange={(e) =>
                                                setSignupForm((prev) => ({ ...prev, name: e.target.value }))
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-[#333]">Phone Number *</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-5 w-5 text-[#9b59b6]" />
                                        <Input
                                            placeholder="9876543210"
                                            className="pl-10 py-6 border-gray-200"
                                            value={signupForm.phoneNumber}
                                            onChange={(e) =>
                                                setSignupForm((prev) => ({ ...prev, phoneNumber: e.target.value }))
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                {/* PinCode */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-[#333]">Pin Code *</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-[#9b59b6]" />
                                        <Input
                                            placeholder="110045"
                                            className="pl-10 py-6 border-gray-200"
                                            value={signupForm.pinCode}
                                            onChange={(e) =>
                                                setSignupForm((prev) => ({ ...prev, pinCode: e.target.value }))
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-[#333]">Location (optional)</Label>
                                    <Input
                                        placeholder="Street, Area, City"
                                        className="py-6 border-gray-200"
                                        value={signupForm.location}
                                        onChange={(e) =>
                                            setSignupForm((prev) => ({ ...prev, location: e.target.value }))
                                        }
                                    />
                                </div>

                                {/* Blood Type */}
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-sm font-semibold text-[#333]">Blood Type *</Label>
                                    <select
                                        className="w-full py-3 px-4 border border-gray-300 rounded-lg bg-white"
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
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-[#333]">Password *</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-[#9b59b6]" />
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10 py-6 border-gray-200"
                                            value={signupForm.password}
                                            onChange={(e) =>
                                                setSignupForm((prev) => ({ ...prev, password: e.target.value }))
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-[#333]">Confirm Password *</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-[#9b59b6]" />
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10 py-6 border-gray-200"
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
                                className="w-full py-6 bg-[#9b59b6] text-white font-semibold hover:opacity-90"
                                disabled={loading}
                            >
                                {loading ? "Creating Account..." : "Create Account"}
                            </Button>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex flex-col space-y-3 pt-6">
                    <div className="text-sm text-center text-[#333]/70">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            className="font-semibold hover:underline text-[#9b59b6]"
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
