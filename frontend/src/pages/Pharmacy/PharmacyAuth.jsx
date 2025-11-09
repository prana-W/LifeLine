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
import {
  Phone,
  Lock,
  User,
  Store,
  Clipboard,
  MapPin,
  Navigation,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import useApi  from "@/hooks/useApi";   // your hook
import { toast } from "sonner";

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

  // ---------------- LOGIN ----------------
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);

    console.log(loginForm);
    

    const { success, message: apiMsg, data } = await api.post(
      "/pharmacy/auth/login",
      loginForm
    );

    setLoading(false);

    if (success) {
      toast.success(apiMsg || "Login successful");
      localStorage.setItem("role", "pharmacy");
      window.location.href = "/";
    } else {
      setMessage({ type: "error", text: apiMsg || "Login failed" });
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

    setLoading(true);

    const payload = { ...signupForm };
    delete payload.confirmPassword;

    const { success, message: apiMsg, data } = await api.post(
      "/pharmacy/auth/signup",
      payload
    );

    setLoading(false);

    if (success) {
      setMessage({ type: "success", text: apiMsg || "Registered successfully" });
      setTimeout(() => setIsLogin(true), 1500);
    } else {
      setMessage({ type: "error", text: apiMsg || "Registration failed" });
    }
  };

  // ---------------------------------------------------------------
  return (
    <div
      className="min-h-screen relative flex items-center justify-center p-4"
      style={{ backgroundColor: "#F2F2F2" }}
    >
      {/* Background Grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="30" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(74,144,226,0.1)"
                strokeWidth="1.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <Card className="w-full max-w-2xl shadow-2xl border-none bg-white relative z-10">
        <CardHeader className="space-y-3 pb-6">
          <div className="flex justify-center">
            <div
              className="p-4 rounded-full hover:scale-110 transition-transform"
              style={{ backgroundColor: "#9b59b6" }}
            >
              <Store className="w-10 h-10 text-white" />
            </div>
          </div>

          <CardTitle className="text-3xl text-center font-bold" style={{ color: "#333" }}>
            {isLogin ? "Pharmacy Login" : "Pharmacy Registration"}
          </CardTitle>

          <CardDescription
            className="text-center text-base"
            style={{ color: "#333", opacity: 0.7 }}
          >
            {isLogin
              ? "Access your pharmacy dashboard"
              : "Register your pharmacy to continue"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {message.text && (
            <Alert
              className={`mb-6 border-none ${
                message.type === "success" ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <AlertDescription
                className={`font-medium ${
                  message.type === "success" ? "text-green-700" : "text-red-700"
                }`}
              >
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          {isLogin ? (
            /* ---------------------------------- LOGIN FORM ---------------------------------- */
            <div className="space-y-5">
              {/* Phone */}
              <div className="space-y-2">
                <Label>
                  Phone Number <span className="text-red-600">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-purple-600" />
                  <Input
                    placeholder="Enter phone number"
                    className="pl-10 py-6"
                    value={loginForm.phoneNumber}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, phoneNumber: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label>
                  Password <span className="text-red-600">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-purple-600" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 py-6"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                  />
                </div>
              </div>

              <Button
                onClick={handleLoginSubmit}
                className="w-full text-white py-6 font-semibold"
                style={{ backgroundColor: "#9b59b6" }}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>
          ) : (
            /* ---------------------------------- SIGNUP FORM ---------------------------------- */
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* shopName optional */}
                <div className="space-y-2">
                  <Label>Shop Name</Label>
                  <div className="relative">
                    <Store className="absolute left-3 top-3 h-5 w-5 text-purple-600" />
                    <Input
                      placeholder="Medico Plus Store"
                      className="pl-10 py-6"
                      value={signupForm.shopName}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, shopName: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* ownerName optional */}
                <div className="space-y-2">
                  <Label>Owner Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-purple-600" />
                    <Input
                      placeholder="Rahul Sharma"
                      className="pl-10 py-6"
                      value={signupForm.ownerName}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, ownerName: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* phoneNumber required */}
                <div className="space-y-2">
                  <Label>
                    Phone Number <span className="text-red-600">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-purple-600" />
                    <Input
                      placeholder="9876543210"
                      className="pl-10 py-6"
                      value={signupForm.phoneNumber}
                      onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* licenseNumber required */}
                <div className="space-y-2">
                  <Label>
                    License Number <span className="text-red-600">*</span>
                  </Label>
                  <div className="relative">
                    <Clipboard className="absolute left-3 top-3 h-5 w-5 text-purple-600" />
                    <Input
                      placeholder="PHAR123456"
                      className="pl-10 py-6"
                      value={signupForm.licenseNumber}
                      onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          licenseNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* pinCode required */}
                <div className="space-y-2">
                  <Label>
                    Pin Code <span className="text-red-600">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-purple-600" />
                    <Input
                      placeholder="400001"
                      className="pl-10 py-6"
                      value={signupForm.pinCode}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, pinCode: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* location optional */}
                <div className="space-y-2">
                  <Label>Location</Label>
                  <div className="relative">
                    <Navigation className="absolute left-3 top-3 h-5 w-5 text-purple-600" />
                    <Input
                      placeholder="Near Apollo Hospital"
                      className="pl-10 py-6"
                      value={signupForm.location}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, location: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* password */}
                <div className="space-y-2">
                  <Label>
                    Password <span className="text-red-600">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-purple-600" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 py-6"
                      value={signupForm.password}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, password: e.target.value })
                      }
                      minLength={6}
                    />
                  </div>
                </div>

                {/* confirm password */}
                <div className="space-y-2">
                  <Label>
                    Confirm Password <span className="text-red-600">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-purple-600" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 py-6"
                      value={signupForm.confirmPassword}
                      onChange={(e) =>
                        setSignupForm({
                          ...signupForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      minLength={6}
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSignupSubmit}
                className="w-full py-6 text-white font-semibold"
                style={{ backgroundColor: "#9b59b6" }}
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <div className="w-full text-center text-sm" style={{ color: "#333", opacity: 0.7 }}>
            {isLogin ? "Don't have an account? " : "Already registered? "}
            <button
              className="font-semibold hover:underline"
              style={{ color: "#9b59b6" }}
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
