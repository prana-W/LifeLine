import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Phone, Lock, MapPin, Heart } from "lucide-react";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

/* ===============================
   Left-side Illustration (teal)
================================= */
function UserIllustration() {
  return (
    <svg viewBox="0 0 500 600" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      {/* Soft blobs */}
      <circle cx="150" cy="120" r="80" fill="#CFF9F0" opacity="0.5" />
      <circle cx="350" cy="200" r="60" fill="#A2EAE0" opacity="0.4" />
      <circle cx="250" cy="350" r="120" fill="#E8E0FF" opacity="0.35" />

      {/* User avatar block */}
      <circle cx="250" cy="200" r="70" fill="#53C7B8" opacity="0.9" />
      <circle cx="250" cy="185" r="35" fill="#E8FFFC" />
      <rect x="200" y="230" width="100" height="80" rx="20" fill="#A6F0E6" opacity="0.9" />

      {/* Phone */}
      <rect x="120" y="320" width="50" height="90" rx="10" fill="#53C7B8" opacity="0.9" />
      <circle cx="145" cy="395" r="6" fill="#E8FFFC" />

      {/* Droplet */}
      <path
        d="M350 330 C330 290 370 260 370 260 C370 260 410 290 390 330 C380 350 350 350 350 330Z"
        fill="#53C7B8"
        opacity="0.85"
      />

      {/* Floating dots */}
      {[...Array(8)].map((_, i) => (
        <circle key={i} cx={80 + i * 50} cy={450 + (i % 3) * 40} r="6" fill="#A2EAE0" opacity="0.5">
          <animate attributeName="cy" values="430;470;430" dur={`${3 + i}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

export default function UserAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
  type: "",
  text: "",
});


  const bloodGroups = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];

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

  // Login
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
        setMessage({ type: "success", text: data?.message || "Logged in" });
        window.location.href = "/";
      } else {
        setMessage({ type: "error", text: data?.message || "Login failed!" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Signup
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (signupForm.password !== signupForm.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      return;
    }
    if (!signupForm.bloodType) {
      setMessage({ type: "error", text: "Please select blood group!" });
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
        toast.success(data?.message);
        setMessage({ type: "success", text: data?.message || "Registered successfully" });
        setTimeout(() => setIsLogin(true), 1200);
      } else {
        setMessage({ type: "error", text: data?.message || "Registration failed!" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-10 bg-gradient-to-br from-[#0F766E] via-[#0E7490] to-[#134E4A]">
      {/* subtle background grid & blobs */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid-user" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-user)" />
        </svg>
      </div>
      <div className="absolute -top-16 -left-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-10 w-[28rem] h-[28rem] bg-white/10 rounded-full blur-3xl" />

      {/* MAIN SPLIT CONTAINER (grid to avoid overflow issues) */}
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* LEFT: Illustration with curved divider */}
          <div className="relative bg-white">
            {/* curved edge on the right side (lg only) */}
            <svg
              className="hidden lg:block absolute right-0 top-0 h-full w-28 z-10"
              viewBox="0 0 100 700"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M 0 0 Q 80 350 0 700 L 0 700 L 0 0 Z" fill="white" />
            </svg>

            {/* tiny grid inside panel */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage: `linear-gradient(#53C7B8 1px, transparent 1px),
                                    linear-gradient(90deg, #53C7B8 1px, transparent 1px)`,
                  backgroundSize: "40px 40px",
                }}
              />
            </div>

            <div className="relative z-0 flex items-center justify-center px-10 py-12 lg:py-20">
              <div className="max-w-md w-full">
                <UserIllustration />
              </div>
            </div>

            <p className="absolute bottom-6 left-8 text-gray-500 text-xs sm:text-sm">
              © 2025 LifeLine User Portal
            </p>
          </div>

          {/* RIGHT: Auth panel (teal gradient) */}
          <div className="relative bg-gradient-to-br from-[#1BA79A] to-[#118A7E] p-6 sm:p-8 lg:p-12">
            <Card className="w-full bg-white/15 backdrop-blur-md border-white/20 shadow-xl rounded-2xl">
              <CardHeader className="text-center pt-8 pb-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 rounded-full bg-white/20 backdrop-blur-md shadow-lg">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                </div>

                <CardTitle className="text-3xl font-bold text-white">
                  {isLogin ? "User Login" : "User Registration"}
                </CardTitle>

                <CardDescription className="text-teal-50 mt-2">
                  {isLogin
                    ? "Access your personal health dashboard"
                    : "Create your user account"}
                </CardDescription>
              </CardHeader>

              <CardContent className="px-6 pb-8 pt-2 space-y-4">
                {message.text && (
                  <Alert
                    className={`border-none ${
                      message.type === "success"
                        ? "bg-green-100/40 text-green-900"
                        : "bg-red-100/40 text-red-900"
                    }`}
                  >
                    <AlertDescription>{message.text}</AlertDescription>
                  </Alert>
                )}

                {/* LOGIN */}
                {isLogin && (
                  <form onSubmit={handleLoginSubmit} className="space-y-6">
                    <div>
                      <Label className="text-white mb-2 block font-medium tracking-wide">
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 text-white/70" />
                        <Input
                          className="pl-10 bg-white/20 text-white placeholder-white/60 border-white/30"
                          placeholder="Enter phone number"
                          value={loginForm.phoneNumber}
                          onChange={(e) =>
                            setLoginForm((p) => ({ ...p, phoneNumber: e.target.value }))
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-white mb-2 block font-medium tracking-wide">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 text-white/70" />
                        <Input
                          type="password"
                          className="pl-10 bg-white/20 text-white placeholder-white/60 border-white/30"
                          placeholder="••••••••"
                          value={loginForm.password}
                          onChange={(e) =>
                            setLoginForm((p) => ({ ...p, password: e.target.value }))
                          }
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-white text-teal-700 font-semibold hover:bg-gray-100"
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                )}

                {/* SIGNUP (TWO COLUMNS) */}
                {!isLogin && (
                  <form onSubmit={handleSignupSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-white mb-2 block font-medium tracking-wide">
                          Full Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 text-white/70" />
                          <Input
                            className="pl-10 bg-white/20 text-white border-white/30 placeholder-white/60"
                            placeholder="John Doe"
                            value={signupForm.name}
                            onChange={(e) =>
                              setSignupForm((p) => ({ ...p, name: e.target.value }))
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-white mb-2 block font-medium tracking-wide">
                          Phone Number
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 text-white/70" />
                          <Input
                            className="pl-10 bg-white/20 text-white border-white/30 placeholder-white/60"
                            placeholder="9876543210"
                            value={signupForm.phoneNumber}
                            onChange={(e) =>
                              setSignupForm((p) => ({ ...p, phoneNumber: e.target.value }))
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-white mb-2 block font-medium tracking-wide">
                          Pin Code
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 text-white/70" />
                          <Input
                            className="pl-10 bg-white/20 text-white border-white/30 placeholder-white/60"
                            placeholder="110045"
                            value={signupForm.pinCode}
                            onChange={(e) =>
                              setSignupForm((p) => ({ ...p, pinCode: e.target.value }))
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-white mb-2 block font-medium tracking-wide">
                          Location
                        </Label>
                        <Input
                          className="bg-white/20 text-white border-white/30 placeholder-white/60"
                          placeholder="City, Area"
                          value={signupForm.location}
                          onChange={(e) =>
                            setSignupForm((p) => ({ ...p, location: e.target.value }))
                          }
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label className="text-white mb-2 block font-medium tracking-wide">
                          Blood Type
                        </Label>
                        <select
                          className="w-full px-4 py-3 bg-white/20 text-white border-white/30 rounded-lg"
                          value={signupForm.bloodType}
                          onChange={(e) =>
                            setSignupForm((p) => ({ ...p, bloodType: e.target.value }))
                          }
                        >
                          <option value="" disabled>
                            Select your blood group
                          </option>
                          {bloodGroups.map((bg) => (
                            <option key={bg} value={bg} className="text-black">
                              {bg}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label className="text-white mb-2 block font-medium tracking-wide">
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 text-white/70" />
                          <Input
                            type="password"
                            className="pl-10 bg-white/20 text-white border-white/30 placeholder-white/60"
                            placeholder="••••••••"
                            value={signupForm.password}
                            onChange={(e) =>
                              setSignupForm((p) => ({ ...p, password: e.target.value }))
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-white mb-2 block font-medium tracking-wide">
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 text-white/70" />
                          <Input
                            type="password"
                            className="pl-10 bg-white/20 text-white border-white/30 placeholder-white/60"
                            placeholder="••••••••"
                            value={signupForm.confirmPassword}
                            onChange={(e) =>
                              setSignupForm((p) => ({ ...p, confirmPassword: e.target.value }))
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-white text-teal-800 font-semibold hover:bg-gray-100"
                      disabled={loading}
                    >
                      {loading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                )}

                {/* TOGGLE */}
                <div className="text-center mt-5 text-white">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    className="underline font-semibold"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setMessage({ type: "", text: "" });
                    }}
                  >
                    {isLogin ? "Sign up" : "Login"}
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
            