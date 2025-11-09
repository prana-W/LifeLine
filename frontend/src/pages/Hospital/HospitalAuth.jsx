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

// ECG Heartbeat Animation Component
function ECGLine({ delay = 0, opacity = 0.3 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 60"
      preserveAspectRatio="none"
      className="absolute w-full h-full"
      style={{ 
        opacity,
        animationDelay: `${delay}s`
      }}
    >
      <defs>
        <linearGradient id={`ecgGradient${delay}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4AD2CC" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#4AD2CC" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#4AD2CC" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={`url(#ecgGradient${delay})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="400"
        strokeDashoffset="400"
        points="0,30 40,30 45,30 48,15 51,45 54,30 57,30 100,30 105,28 108,25 111,35 114,30 160,30 200,30"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="400;0;400"
          dur="4s"
          repeatCount="indefinite"
        />
      </polyline>
    </svg>
  );
}

// Animated Plus Signs
function MedicalPlus({ delay, duration }) {
  return (
    <div
      className="absolute text-teal-400/20 font-bold text-4xl animate-float"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }}
    >
      +
    </div>
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      
      <style>{`
        @keyframes ecgPulse {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.2); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          50% { transform: translateY(-100vh) translateX(50px) rotate(180deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
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
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          10%, 30% { transform: scale(1.15); }
          20%, 40% { transform: scale(1); }
        }
        .animate-float {
          animation: float linear infinite;
        }
        .animate-ecgPulse {
          animation: ecgPulse 2s ease-in-out infinite;
        }
        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out forwards;
        }
        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
        .animate-heartbeat {
          animation: heartbeat 1.5s ease-in-out infinite;
        }
        .input-focus:focus {
          transform: scale(1.02);
          transition: all 0.3s ease;
        }
      `}</style>

      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="h-full w-full animate-pulse-slow"
          style={{
            backgroundImage: `linear-gradient(#4AD2CC 1.5px, transparent 1.5px), 
            linear-gradient(90deg, #4AD2CC 1.5px, transparent 1.5px)`,
            backgroundSize: '60px 60px'
          }}
        ></div>
      </div>

      {/* Multiple ECG Lines at Different Positions */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-full" style={{ top: '15%', height: '80px' }}>
          <ECGLine delay={0} opacity={0.25} />
        </div>
        <div className="absolute w-full" style={{ top: '40%', height: '80px' }}>
          <ECGLine delay={1.5} opacity={0.2} />
        </div>
        <div className="absolute w-full" style={{ top: '65%', height: '80px' }}>
          <ECGLine delay={3} opacity={0.25} />
        </div>
        <div className="absolute w-full" style={{ top: '85%', height: '80px' }}>
          <ECGLine delay={2} opacity={0.15} />
        </div>
      </div>

      {/* Floating Medical Plus Signs */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <MedicalPlus key={i} delay={i * 0.8} duration={8 + Math.random() * 6} />
        ))}
      </div>

      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-3 animate-pulse-slow"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-3 animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <Card className="relative shadow-2xl rounded-3xl bg-white/95 backdrop-blur-md border-2 border-teal-100 hover:border-teal-300 transition-all duration-500 hover:shadow-teal-200/50 hover:shadow-3xl group overflow-hidden animate-slideInUp">
          
          {/* Shimmer Effect */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            <div 
              className="absolute inset-0 animate-shimmer"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(74, 210, 204, 0.1), transparent)',
                backgroundSize: '1000px 100%'
              }}
            ></div>
          </div>

          <CardHeader className="space-y-3 pb-6 relative">
            <div className="flex items-center justify-center mb-2">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-400 via-cyan-400 to-teal-500 group-hover:scale-110 transition-all duration-500 shadow-xl hover:shadow-teal-400/50 animate-heartbeat">
                <Building2 className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl text-center font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-700 bg-clip-text text-transparent">
              {isLogin ? 'Hospital Login' : 'Hospital Registration'}
            </CardTitle>
            <CardDescription className="text-center text-base text-gray-600">
              {isLogin
                ? 'Access your hospital admin dashboard'
                : 'Create your hospital account'}
            </CardDescription>
          </CardHeader>

          <CardContent className="relative">
            {message.text && (
              <Alert
                className={`mb-6 border-2 animate-slideInUp ${
                  message.type === 'success'
                    ? 'bg-green-50 border-green-200 shadow-lg shadow-green-100'
                    : 'bg-red-50 border-red-200 shadow-lg shadow-red-100'
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
                <div className="space-y-2 animate-slideInUp" style={{ animationDelay: '0.1s' }}>
                  <Label className="text-base font-semibold text-gray-700">
                    Email
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-teal-500 transition-all duration-300 group-hover:scale-110 group-hover:text-cyan-500" />
                    <Input
                      placeholder="hospital@email.com"
                      className="pl-10 h-12 border-2 border-gray-200 rounded-xl input-focus transition-all duration-300 focus:border-teal-400 focus:ring-2 focus:ring-teal-200"
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
                  <Label className="text-base font-semibold text-gray-700">
                    Password
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-teal-500 transition-all duration-300 group-hover:scale-110 group-hover:text-cyan-500" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 h-12 border-2 border-gray-200 rounded-xl input-focus transition-all duration-300 focus:border-teal-400 focus:ring-2 focus:ring-teal-200"
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
                  className="w-full h-14 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl hover:shadow-teal-300/50 transition-all duration-300 transform hover:scale-105 animate-slideInUp"
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
                  ) : 'Login'}
                </Button>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Name */}
                <div className="space-y-2 animate-slideInUp" style={{ animationDelay: '0.1s' }}>
                  <Label className="text-base font-semibold text-gray-700">
                    Hospital Name *
                  </Label>
                  <div className="relative group">
                    <Home className="absolute left-3 top-3.5 h-5 w-5 text-teal-500 transition-all duration-300 group-hover:scale-110 group-hover:text-cyan-500" />
                    <Input
                      placeholder="City Medical Center"
                      className="pl-10 h-12 border-2 border-gray-200 rounded-xl input-focus transition-all duration-300 focus:border-teal-400 focus:ring-2 focus:ring-teal-200"
                      value={signupForm.name}
                      onChange={(e) =>
                        setSignupForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>

                {/* Pin code */}
                <div className="space-y-2 animate-slideInUp" style={{ animationDelay: '0.15s' }}>
                  <Label className="text-base font-semibold text-gray-700">
                    Pin Code *
                  </Label>
                  <div className="relative group">
                    <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-teal-500 transition-all duration-300 group-hover:scale-110 group-hover:text-cyan-500" />
                    <Input
                      placeholder="110045"
                      className="pl-10 h-12 border-2 border-gray-200 rounded-xl input-focus transition-all duration-300 focus:border-teal-400 focus:ring-2 focus:ring-teal-200"
                      value={signupForm.pinCode}
                      onChange={(e) =>
                        setSignupForm((prev) => ({ ...prev, pinCode: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>

                {/* Location (optional) */}
                <div className="space-y-2 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
                  <Label className="text-base font-semibold text-gray-700">
                    Location (optional)
                  </Label>
                  <div className="relative group">
                    <Building2 className="absolute left-3 top-3.5 h-5 w-5 text-teal-500 transition-all duration-300 group-hover:scale-110 group-hover:text-cyan-500" />
                    <Input
                      placeholder="Gomti Nagar, Lucknow"
                      className="pl-10 h-12 border-2 border-gray-200 rounded-xl input-focus transition-all duration-300 focus:border-teal-400 focus:ring-2 focus:ring-teal-200"
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
                <div className="space-y-2 animate-slideInUp" style={{ animationDelay: '0.25s' }}>
                  <Label className="text-base font-semibold text-gray-700">
                    Email *
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-teal-500 transition-all duration-300 group-hover:scale-110 group-hover:text-cyan-500" />
                    <Input
                      placeholder="hospital@email.com"
                      className="pl-10 h-12 border-2 border-gray-200 rounded-xl input-focus transition-all duration-300 focus:border-teal-400 focus:ring-2 focus:ring-teal-200"
                      value={signupForm.email}
                      onChange={(e) =>
                        setSignupForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2 animate-slideInUp" style={{ animationDelay: '0.3s' }}>
                  <Label className="text-base font-semibold text-gray-700">
                    Password *
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-teal-500 transition-all duration-300 group-hover:scale-110 group-hover:text-cyan-500" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 h-12 border-2 border-gray-200 rounded-xl input-focus transition-all duration-300 focus:border-teal-400 focus:ring-2 focus:ring-teal-200"
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
                <div className="space-y-2 animate-slideInUp" style={{ animationDelay: '0.35s' }}>
                  <Label className="text-base font-semibold text-gray-700">
                    Confirm Password *
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-teal-500 transition-all duration-300 group-hover:scale-110 group-hover:text-cyan-500" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 h-12 border-2 border-gray-200 rounded-xl input-focus transition-all duration-300 focus:border-teal-400 focus:ring-2 focus:ring-teal-200"
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
                  className="w-full h-14 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl hover:shadow-teal-300/50 transition-all duration-300 transform hover:scale-105 animate-slideInUp"
                  style={{ animationDelay: '0.4s' }}
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
                  ) : 'Create Account'}
                </Button>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 pt-6 relative">
            <div className="text-sm text-center text-gray-600">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                className="font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent hover:underline transition-all duration-300 hover:scale-105 inline-block"
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