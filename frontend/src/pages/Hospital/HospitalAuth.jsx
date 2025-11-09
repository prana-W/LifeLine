import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Stethoscope, Mail, Lock, Building2, MapPin, Home } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

// Heartbeat Animation Component
function HeartbeatLine() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 150 40"
      preserveAspectRatio="none"
      className="absolute w-full h-20 stroke-[#4AD2CC] opacity-20"
      style={{ top: '50%', transform: 'translateY(-50%)' }}
    >
      <polyline
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="220"
        strokeDashoffset="220"
        points="0,20 20,20 25,15 30,25 40,20 60,20 65,5 70,35 75,20 95,20 100,15 110,20 150,20"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="220;0"
          dur="2s"
          repeatCount="indefinite"
        />
      </polyline>
    </svg>
  );
}

export default function HospitalAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [signupForm, setSignupForm] = useState({
    name: '',
    pinCode: '',
    location: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Login handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/hospital/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(loginForm)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || 'Login successful!');
        localStorage.setItem('role', 'hospital');
        setMessage({ type: 'success', text: data.message || 'Login successful!' });
        window.location.href = '/';
      } else {
        setMessage({ type: 'error', text: data.message || 'Login failed!' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Signup handler
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (signupForm.password !== signupForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match!' });
      return;
    }

    setLoading(true);

    const { confirmPassword, ...signupData } = signupForm;

    try {
      const res = await fetch(`${API_BASE_URL}/hospital/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData)
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || 'Registration successful!');
        setMessage({ type: 'success', text: data.message || 'Registration successful!' });
        setTimeout(() => setIsLogin(true), 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Registration failed!' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F2F2F2] relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `linear-gradient(#4A90E2 1px, transparent 1px), 
            linear-gradient(90deg, #4A90E2 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Heartbeat Background */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <HeartbeatLine />
        </div>

        <Card className="relative shadow-2xl rounded-3xl bg-white/95 backdrop-blur-sm border-2 border-[#4AD2CC]/20 hover:border-[#4AD2CC]/40 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(74,210,204,0.3)] group">
          <CardHeader className="space-y-3 pb-6">
            <div className="flex items-center justify-center mb-2">
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#4AD2CC] to-[#3BB5AF] group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Building2 className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl text-center font-bold text-[#333]">
              {isLogin ? 'Hospital Login' : 'Hospital Registration'}
            </CardTitle>
            <CardDescription className="text-center text-base text-gray-600">
              {isLogin
                ? 'Access your hospital admin dashboard'
                : 'Create your hospital account'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {message.text && (
              <Alert
                className={`mb-6 border-2 ${
                  message.type === 'success'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <AlertDescription
                  className={`font-medium ${
                    message.type === 'success' ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            {isLogin ? (
              <div className="space-y-5">
                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-[#333]">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-[#4AD2CC]" />
                    <Input
                      placeholder="hospital@email.com"
                      className="pl-10 h-12 border-2 border-gray-300 rounded-xl"
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-[#333]">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-[#4AD2CC]" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 h-12 border-2 border-gray-300 rounded-xl"
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
                  className="w-full h-14 bg-gradient-to-r from-[#4AD2CC] to-[#3BB5AF] text-white font-semibold rounded-xl shadow-lg hover:scale-[1.02]"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-[#333]">
                    Hospital Name *
                  </Label>
                  <div className="relative">
                    <Home className="absolute left-3 top-3.5 h-5 w-5 text-[#4A90E2]" />
                    <Input
                      placeholder="City Medical Center"
                      className="pl-10 h-12 border-2 border-gray-300 rounded-xl"
                      value={signupForm.name}
                      onChange={(e) =>
                        setSignupForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>

                {/* Pin code */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-[#333]">
                    Pin Code *
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-[#4A90E2]" />
                    <Input
                      placeholder="110045"
                      className="pl-10 h-12 border-2 border-gray-300 rounded-xl"
                      value={signupForm.pinCode}
                      onChange={(e) =>
                        setSignupForm((prev) => ({ ...prev, pinCode: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>

                {/* Location (optional) */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-[#333]">
                    Location (optional)
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3.5 h-5 w-5 text-[#4A90E2]" />
                    <Input
                      placeholder="Gomti Nagar, Lucknow"
                      className="pl-10 h-12 border-2 border-gray-300 rounded-xl"
                      value={signupForm.location}
                      onChange={(e) =>
                        setSignupForm((prev) => ({
                          ...prev,
                          location: e.target.value
                        }))
                      }
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-[#333]">
                    Email *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-[#4A90E2]" />
                    <Input
                      placeholder="hospital@email.com"
                      className="pl-10 h-12 border-2 border-gray-300 rounded-xl"
                      value={signupForm.email}
                      onChange={(e) =>
                        setSignupForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-[#333]">
                    Password *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-[#4A90E2]" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 h-12 border-2 border-gray-300 rounded-xl"
                      value={signupForm.password}
                      onChange={(e) =>
                        setSignupForm((prev) => ({
                          ...prev,
                          password: e.target.value
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-[#333]">
                    Confirm Password *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-[#4A90E2]" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 h-12 border-2 border-gray-300 rounded-xl"
                      value={signupForm.confirmPassword}
                      onChange={(e) =>
                        setSignupForm((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSignupSubmit}
                  className="w-full h-14 bg-gradient-to-r from-[#4AD2CC] to-[#3BB5AF] text-white font-semibold rounded-xl shadow-lg hover:scale-[1.02]"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 pt-6">
            <div className="text-sm text-center text-gray-600">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                className="font-semibold text-[#4AD2CC] hover:underline"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage({ type: '', text: '' });
                }}
              >
                {isLogin ? 'Sign up' : 'Login'}
              </button>
            </div>

            <p className="text-xs text-center text-gray-400">
              MediBridge Secure Hospital Portal
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
