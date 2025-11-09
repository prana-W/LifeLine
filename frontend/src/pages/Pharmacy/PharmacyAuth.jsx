import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Phone,
  Lock,
  User,
  Store,
  Clipboard,
  MapPin,
  Navigation,
  Pill,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import useApi from "@/hooks/useApi";
import { toast } from "sonner";

// ---------------------- PHARMACY SVG -------------------------
function PharmacyIllustration() {
  return (
    <svg viewBox="0 0 500 600" className="w-full h-full">
      {/* Shelf */}
      <rect x="120" y="250" width="260" height="20" fill="#B8A8FF" opacity="0.4" rx="4" />

      {/* Pill Bottles */}
      <g>
        <rect x="150" y="180" width="60" height="70" fill="#C8F4E5" rx="6" />
        <rect x="160" y="190" width="40" height="20" fill="#58C09A" rx="4" />

        <rect x="240" y="170" width="55" height="80" fill="#B8A8FF" rx="6" />
        <rect x="250" y="180" width="35" height="20" fill="#7A67C7" rx="4" />

        <rect x="325" y="190" width="60" height="60" fill="#C8F4E5" rx="6" />
        <rect x="335" y="200" width="40" height="18" fill="#58C09A" rx="4" />
      </g>

      {/* Big Pill */}
      <g opacity="0.8">
        <ellipse cx="130" cy="430" rx="50" ry="25" fill="#B8A8FF" transform="rotate(-20 130 430)" />
        <ellipse cx="165" cy="410" rx="50" ry="25" fill="#C8F4E5" transform="rotate(-20 165 410)" />
      </g>

      {/* Pharmacist */}
      <g>
        <circle cx="260" cy="450" r="35" fill="#C8F4E5" />
        <rect x="225" y="480" width="70" height="90" fill="#7A67C7" rx="10" />
        <rect x="205" y="505" width="25" height="60" fill="#B8A8FF" rx="6" />
        <rect x="305" y="505" width="25" height="60" fill="#B8A8FF" rx="6" />
      </g>

      {/* Floating Particles */}
      {[...Array(9)].map((_, i) => (
        <circle
          key={i}
          cx={60 + i * 45}
          cy={100 + (i % 3) * 120}
          r="3.5"
          fill="#B8A8FF"
          opacity="0.35"
        />
      ))}
    </svg>
  );
}

// MAIN COMPONENT
export default function PharmacyAuth() {
  const navigate = useNavigate();
  const api = useApi();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [loginForm, setLoginForm] = useState({
    phoneNumber: "",
    password: "",
  });

  const [signupForm, setSignupForm] = useState({
    shopName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    ownerName: "",
    licenseNumber: "",
    pinCode: "",
    location: "",
  });

  // LOGIN
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);

    const { success, message: apiMsg } = await api.post(
      "/pharmacy/auth/login",
      loginForm
    );

    setLoading(false);

    if (success) {
      toast.success(apiMsg);
      localStorage.setItem("role", "pharmacy");
      window.location.href = "/";
    } else {
      setMessage({ type: "error", text: apiMsg });
    }
  };

  // SIGNUP
  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (signupForm.password !== signupForm.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match!" });
      return;
    }

    setLoading(true);

    const payload = { ...signupForm };
    delete payload.confirmPassword;

    const { success, message: apiMsg } = await api.post(
      "/pharmacy/auth/signup",
      payload
    );

    setLoading(false);

    if (success) {
      setMessage({ type: "success", text: apiMsg });
      setTimeout(() => setIsLogin(true), 1500);
    } else {
      setMessage({ type: "error", text: apiMsg });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-600 via-mint-600 to-mint-600"
      style={{
        background: "linear-gradient(135deg, #D8C4FF, #BFA6FF, #A78FFF, #957AFF)",
      }}
    >
      {/* ANIMATIONS */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0px); }
        }
        .animate-float { animation: float 3.5s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
      `}</style>

      {/* Floating Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-24 w-32 h-32 bg-white rounded-full opacity-10 animate-float"></div>
        <div className="absolute bottom-20 right-32 w-40 h-40 bg-lavender-300 rounded-full opacity-10 animate-float" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-mint-200 rounded-full opacity-10 animate-float" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="min-h-screen flex items-center justify-center p-4 lg:p-8">
        <div className="relative w-full max-w-7xl h-[630px] lg:h-[700px] animate-fadeIn">

          {/* LEFT PANEL */}
          <div className="absolute inset-0 lg:left-0 lg:right-1/2">
            <div className="relative w-full h-full bg-white rounded-3xl lg:rounded-r-none overflow-hidden shadow-2xl">

              {/* Curved Divider */}
              <svg
                className="hidden lg:block absolute right-0 top-0 h-full w-32 z-20"
                viewBox="0 0 100 700"
                preserveAspectRatio="none"
              >
                <path d="M 0 0 Q 80 350 0 700 L 0 700 L 0 0 Z" fill="white" />
              </svg>

              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage: `linear-gradient(#B8A8FF 1px, transparent 1px),
                                     linear-gradient(90deg, #B8A8FF 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                  }}
                ></div>
              </div>

              {/* Logo */}
              <div className="absolute top-8 left-8 z-10 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#C8F4E5] to-[#A692F8] rounded-full flex items-center justify-center">
                  <Pill className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#7A67C7]">MediBridge</h1>
                  <p className="text-xs text-gray-500">Pharmacy Portal</p>
                </div>
              </div>

              {/* Illustration */}
              <div className="hidden lg:flex items-center justify-center h-full px-12">
                <div className="max-w-md animate-float">
                  <PharmacyIllustration />
                </div>
              </div>

              {/* Decorative circles */}
              <div className="absolute bottom-20 left-20 w-20 h-20 bg-[#C8F4E5] rounded-full opacity-20"></div>
              <div className="absolute top-32 right-32 w-16 h-16 bg-[#B8A8FF] rounded-full opacity-20"></div>

              {/* Footer */}
              <div className="absolute bottom-8 left-8 text-xs text-gray-400">
                <p>© 2024 MediBridge Pharmacy Portal</p>
                <p>Powered by HealthTech</p>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="absolute inset-0 lg:left-1/2 lg:right-0">
            <div className="relative w-full h-full bg-gradient-to-br from-[#C8F4E5] to-[#B8A8FF] rounded-3xl lg:rounded-l-none overflow-hidden shadow-2xl">

              {/* Background grid */}
              <div className="absolute inset-0 opacity-5">
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage: `linear-gradient(white 1px, transparent 1px),
                                     linear-gradient(90deg, white 1px, transparent 1px)`,
                    backgroundSize: "30px 30px",
                  }}
                ></div>
              </div>

              {/* FORM */}
              <div className="relative h-full flex items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-md bg-white/30 backdrop-blur-xl rounded-2xl p-8 shadow-xl">

                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-white/20 rounded-2xl mb-4">
                      <Store className="w-10 h-10 text-[#7A67C7]" />
                    </div>

                    <h2 className="text-4xl font-bold text-violet-500">
                      {isLogin ? "Login" : "Register"}
                    </h2>
                    <p className="text-violet-500 text-sm">
                      {isLogin ? "Access your pharmacy account" : "Create your pharmacy account"}
                    </p>
                  </div>

                  {/* Alert */}
                  {message.text && (
                    <Alert
                      className={`mb-4 border-none ${
                        message.type === "success"
                          ? "bg-green-500/20 text-white"
                          : "bg-red-500/20 text-white"
                      }`}
                    >
                      <AlertDescription>{message.text}</AlertDescription>
                    </Alert>
                  )}

                  {/* LOGIN FORM */}
                  {isLogin ? (
                    <form className="space-y-4" onSubmit={handleLoginSubmit}>
                      <div>
                        <Label className="text-violet-500 mb-1.5">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 text-violet-500/70" />
                          <Input
                            className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60"
                            value={loginForm.phoneNumber}
                            onChange={(e) =>
                              setLoginForm({ ...loginForm, phoneNumber: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-violet-500 mb-1.5">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 text-violet-500/70" />
                          <Input
                            type="password"
                            className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60"
                            value={loginForm.password}
                            onChange={(e) =>
                              setLoginForm({ ...loginForm, password: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>

                      <Button
                        className="w-full bg-[#7A67C7] hover:bg-[#6a58b0] text-white h-12 rounded-xl shadow-lg transition-all"
                        disabled={loading}
                      >
                        {loading ? "Logging in..." : "Login"}
                      </Button>
                    </form>
                  ) : (
                    // SIGNUP FORM
                    <form className="space-y-3" onSubmit={handleSignupSubmit}>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-violet-500 mb-1.5">Shop Name</Label>
                          <Input
                            className="bg-white/20 border-white/30 text-black"
                            value={signupForm.shopName}
                            onChange={(e) =>
                              setSignupForm({ ...signupForm, shopName: e.target.value })
                            }
                          />
                        </div>

                        <div>
                          <Label className="text-violet-500 mb-1.5">Owner Name</Label>
                          <Input
                            className="bg-white/20 border-white/30 text-black"
                            value={signupForm.ownerName}
                            onChange={(e) =>
                              setSignupForm({ ...signupForm, ownerName: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-violet-500 mb-1.5">Phone Number *</Label>
                        <Input
                          className="bg-white/20 border-white/30 text-black"
                          value={signupForm.phoneNumber}
                          onChange={(e) =>
                            setSignupForm({ ...signupForm, phoneNumber: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div>
                        <Label className="text-violet-500 mb-1.5">License Number *</Label>
                        <Input
                          className="bg-white/20 border-white/30 text-black"
                          value={signupForm.licenseNumber}
                          onChange={(e) =>
                            setSignupForm({ ...signupForm, licenseNumber: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-violet-500 mb-1.5">Pin Code *</Label>
                          <Input
                            className="bg-white/20 border-white/30 text-black"
                            value={signupForm.pinCode}
                            onChange={(e) =>
                              setSignupForm({ ...signupForm, pinCode: e.target.value })
                            }
                            required
                          />
                        </div>

                        <div>
                          <Label className="text-violet-500 mb-1.5">Location</Label>
                          <Input
                            className="bg-white/20 border-white/30 text-black"
                            value={signupForm.location}
                            onChange={(e) =>
                              setSignupForm({ ...signupForm, location: e.target.value })
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-violet-500 mb-1.5">Password *</Label>
                          <Input
                            type="password"
                            className="bg-white/20 border-white/30 text-black"
                            value={signupForm.password}
                            onChange={(e) =>
                              setSignupForm({ ...signupForm, password: e.target.value })
                            }
                            required
                          />
                        </div>

                        <div>
                          <Label className="text-violet-500 mb-1.5">Confirm *</Label>
                          <Input
                            type="password"
                            className="bg-white/20 border-white/30 text-black"
                            value={signupForm.confirmPassword}
                            onChange={(e) =>
                              setSignupForm({
                                ...signupForm,
                                confirmPassword: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <Button
                        className="w-full bg-[#7A67C7] hover:bg-[#6a58b0] text-white h-12 rounded-xl shadow-lg"
                        disabled={loading}
                      >
                        {loading ? "Creating..." : "Create Account"}
                      </Button>
                    </form>
                  )}

                  {/* Toggle */}
                  <p className="text-center text-violet-500 mt-6">
                    {isLogin ? "Don't have an account?" : "Already registered?"}{" "}
                    <button
                      className="text-violet-500 font-semibold hover:underline"
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setMessage({ type: "", text: "" });
                      }}
                    >
                      {isLogin ? "Register" : "Login"}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
