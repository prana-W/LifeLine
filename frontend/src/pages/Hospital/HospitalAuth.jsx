import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, Building2, MapPin, Home, Activity } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

// Medical Illustration SVG Component
function MedicalIllustration() {
  return (
    <svg viewBox="0 0 500 600" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Hospital Building */}
      <g>
        {/* Main Building */}
        <rect x="150" y="200" width="200" height="250" fill="#4AD2CC" opacity="0.2" rx="10"/>
        <rect x="160" y="210" width="180" height="230" fill="#3BB5AF" opacity="0.3" rx="8"/>
        
        {/* Windows */}
        {[0, 1, 2, 3].map((row) => (
          [0, 1, 2].map((col) => (
            <rect
              key={`${row}-${col}`}
              x={180 + col * 50}
              y={230 + row * 50}
              width="30"
              height="35"
              fill="#ffffff"
              opacity="0.6"
              rx="3"
            />
          ))
        ))}
        
        {/* Cross on building */}
        <rect x="235" y="150" width="30" height="80" fill="#ffffff" rx="5"/>
        <rect x="210" y="175" width="80" height="30" fill="#ffffff" rx="5"/>
        <rect x="240" y="155" width="20" height="70" fill="#4AD2CC" rx="3"/>
        <rect x="215" y="180" width="70" height="20" fill="#4AD2CC" rx="3"/>
      </g>

      {/* Floating Medical Icons */}
      <g opacity="0.5">
        {/* Stethoscope */}
        <circle cx="100" cy="150" r="8" fill="#4AD2CC"/>
        <path d="M 100 158 Q 100 180, 85 190" stroke="#4AD2CC" strokeWidth="3" fill="none"/>
        <path d="M 100 158 Q 100 180, 115 190" stroke="#4AD2CC" strokeWidth="3" fill="none"/>
        <circle cx="85" cy="195" r="8" fill="#4AD2CC"/>
        <circle cx="115" cy="195" r="8" fill="#4AD2CC"/>
        
        {/* Heart */}
        <path d="M 400 200 C 400 190, 410 180, 420 180 C 430 180, 440 190, 440 200 C 440 220, 420 240, 400 260 C 380 240, 360 220, 360 200 C 360 190, 370 180, 380 180 C 390 180, 400 190, 400 200 Z" fill="#FF6B8A" opacity="0.6">
          <animateTransform
            attributeName="transform"
            type="scale"
            values="1;1.1;1"
            dur="1.5s"
            repeatCount="indefinite"
            additive="sum"
          />
        </path>
        
        {/* Pills */}
        <ellipse cx="80" cy="400" rx="15" ry="8" fill="#4AD2CC" transform="rotate(-45 80 400)"/>
        <ellipse cx="420" cy="380" rx="15" ry="8" fill="#3BB5AF" transform="rotate(30 420 380)"/>
      </g>

      {/* Doctor/Nurse Figures */}
      <g>
        {/* Left Figure */}
        <circle cx="120" cy="480" r="20" fill="#4AD2CC"/>
        <rect x="105" y="500" width="30" height="60" fill="#3BB5AF" rx="5"/>
        <rect x="95" y="510" width="15" height="40" fill="#4AD2CC" rx="3"/>
        <rect x="130" y="510" width="15" height="40" fill="#4AD2CC" rx="3"/>
        
        {/* Right Figure */}
        <circle cx="380" cy="480" r="20" fill="#5DCFC9"/>
        <rect x="365" y="500" width="30" height="60" fill="#4AD2CC" rx="5"/>
        <rect x="355" y="510" width="15" height="40" fill="#3BB5AF" rx="3"/>
        <rect x="390" y="510" width="15" height="40" fill="#3BB5AF" rx="3"/>
      </g>

      {/* Floating Particles */}
      {[...Array(8)].map((_, i) => (
        <circle
          key={i}
          cx={50 + i * 60}
          cy={100 + (i % 3) * 150}
          r="3"
          fill="#4AD2CC"
          opacity="0.3"
        >
          <animate
            attributeName="cy"
            values={`${100 + (i % 3) * 150};${80 + (i % 3) * 150};${100 + (i % 3) * 150}`}
            dur={`${2 + i * 0.3}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}

      {/* ECG Line */}
      <polyline
        points="50,350 100,350 110,340 120,360 130,350 200,350 210,345 220,355 230,350 300,350"
        fill="none"
        stroke="#4AD2CC"
        strokeWidth="2"
        opacity="0.4"
      >
        <animate
          attributeName="stroke-dasharray"
          values="0,300;300,0"
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800">
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated circles */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-teal-400 rounded-full opacity-10 animate-float"></div>
        <div className="absolute bottom-40 right-40 w-40 h-40 bg-cyan-400 rounded-full opacity-10 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-teal-300 rounded-full opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Container */}
      <div className="min-h-screen flex items-center justify-center p-4 lg:p-8">
        <div className="relative w-full max-w-7xl h-[600px] lg:h-[700px] animate-fadeIn">
          
          {/* White curved section with illustration */}
          <div className="absolute inset-0 lg:left-0 lg:right-1/2">
            <div className="relative w-full h-full bg-white rounded-3xl lg:rounded-r-none overflow-hidden shadow-2xl">
              
              {/* Curved edge SVG - only visible on large screens */}
              <svg 
                className="hidden lg:block absolute right-0 top-0 h-full w-32 z-20" 
                viewBox="0 0 100 700" 
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M 0 0 Q 80 350 0 700 L 0 700 L 0 0 Z" 
                  fill="white"
                />
              </svg>

              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage: `linear-gradient(#4AD2CC 1px, transparent 1px), 
                    linear-gradient(90deg, #4AD2CC 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                  }}
                ></div>
              </div>

              {/* Logo/Title */}
              <div className="absolute top-8 left-8 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-teal-700">MediBridge</h1>
                    <p className="text-xs text-gray-500">Hospital Portal</p>
                  </div>
                </div>
              </div>

              {/* Illustration */}
              <div className="hidden lg:flex items-center justify-center h-full px-12">
                <div className="max-w-md animate-float">
                  <MedicalIllustration />
                </div>
              </div>

              {/* Decorative circles on white side */}
              <div className="absolute bottom-20 left-20 w-20 h-20 bg-teal-200 rounded-full opacity-20"></div>
              <div className="absolute top-32 right-32 w-16 h-16 bg-cyan-200 rounded-full opacity-20"></div>

              {/* Footer text */}
              <div className="absolute bottom-8 left-8 text-xs text-gray-400">
                <p>© 2024 MediBridge Hospital Portal</p>
                <p>Powered by HealthTech</p>
              </div>
            </div>
          </div>

          {/* Teal curved section with form */}
          <div className="absolute inset-0 lg:left-1/2 lg:right-0">
            <div className="relative w-full h-full bg-gradient-to-br from-teal-600 to-teal-800 rounded-3xl lg:rounded-l-none overflow-hidden shadow-2xl">
              
              {/* Background pattern on form side */}
              <div className="absolute inset-0 opacity-5">
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage: `linear-gradient(white 1px, transparent 1px), 
                    linear-gradient(90deg, white 1px, transparent 1px)`,
                    backgroundSize: '30px 30px'
                  }}
                ></div>
              </div>

              {/* ECG Animation on form side */}
              <svg className="absolute w-full h-24 top-1/4 opacity-10" viewBox="0 0 1000 100" preserveAspectRatio="none">
                <polyline
                  points="0,50 200,50 220,30 240,70 260,50 500,50 520,45 540,55 560,50 1000,50"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                >
                  <animate
                    attributeName="stroke-dasharray"
                    values="0,1000;1000,0"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </polyline>
              </svg>

              {/* Form Content */}
              <div className="relative h-full flex items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-md">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
                      <Building2 className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-2">
                      {isLogin ? 'Login' : 'Register'}
                    </h2>
                    <p className="text-teal-100 text-sm">
                      {isLogin ? 'Access your hospital dashboard' : 'Create your hospital account'}
                    </p>
                  </div>

                  {/* Alert Message */}
                  {message.text && (
                    <Alert className={`mb-6 border-0 ${message.type === 'success' ? 'bg-green-500/20 text-white' : 'bg-red-500/20 text-white'}`}>
                      <AlertDescription className="font-medium">
                        {message.text}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Form */}
                  {isLogin ? (
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-5 w-5 text-teal-300" />
                          <Input
                            placeholder="Enter your email"
                            className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-teal-200 rounded-xl focus:bg-white/15 focus:border-white/40"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-teal-300" />
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-teal-200 rounded-xl focus:bg-white/15 focus:border-white/40"
                            value={loginForm.password}
                            onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div className="text-right">
                        <button className="text-teal-200 hover:text-white text-sm transition-colors">
                          Forgot Password?
                        </button>
                      </div>

                      <Button
                        onClick={handleLoginSubmit}
                        className="w-full h-12 bg-cyan-400 hover:bg-cyan-500 text-teal-900 font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] mt-6"
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Logging in...
                          </span>
                        ) : 'Login to WiFi'}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">Hospital Name</Label>
                        <div className="relative">
                          <Home className="absolute left-3 top-3 h-5 w-5 text-teal-300" />
                          <Input
                            placeholder="Enter hospital name"
                            className="pl-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-teal-200 rounded-xl focus:bg-white/15 focus:border-white/40"
                            value={signupForm.name}
                            onChange={(e) => setSignupForm((prev) => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-white text-sm font-medium">Pin Code</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-5 w-5 text-teal-300" />
                            <Input
                              placeholder="Pin code"
                              className="pl-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-teal-200 rounded-xl focus:bg-white/15 focus:border-white/40"
                              value={signupForm.pinCode}
                              onChange={(e) => setSignupForm((prev) => ({ ...prev, pinCode: e.target.value }))}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-white text-sm font-medium">Location</Label>
                          <Input
                            placeholder="City"
                            className="h-11 bg-white/10 border-white/20 text-white placeholder:text-teal-200 rounded-xl focus:bg-white/15 focus:border-white/40"
                            value={signupForm.location}
                            onChange={(e) => setSignupForm((prev) => ({ ...prev, location: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-5 w-5 text-teal-300" />
                          <Input
                            placeholder="Enter email"
                            className="pl-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-teal-200 rounded-xl focus:bg-white/15 focus:border-white/40"
                            value={signupForm.email}
                            onChange={(e) => setSignupForm((prev) => ({ ...prev, email: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-white text-sm font-medium">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-teal-300" />
                            <Input
                              type="password"
                              placeholder="Password"
                              className="pl-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-teal-200 rounded-xl focus:bg-white/15 focus:border-white/40"
                              value={signupForm.password}
                              onChange={(e) => setSignupForm((prev) => ({ ...prev, password: e.target.value }))}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-white text-sm font-medium">Confirm</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-teal-300" />
                            <Input
                              type="password"
                              placeholder="Confirm"
                              className="pl-10 h-11 bg-white/10 border-white/20 text-white placeholder:text-teal-200 rounded-xl focus:bg-white/15 focus:border-white/40"
                              value={signupForm.confirmPassword}
                              onChange={(e) => setSignupForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={handleSignupSubmit}
                        className="w-full h-12 bg-cyan-400 hover:bg-cyan-500 text-teal-900 font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] mt-4"
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Account...
                          </span>
                        ) : 'Create Account'}
                      </Button>
                    </div>
                  )}

                  {/* Toggle Login/Signup */}
                  <div className="text-center mt-6">
                    <p className="text-teal-100 text-sm">
                      {isLogin ? "Don't have an account?" : "Already have an account?"}
                      {' '}
                      <button
                        onClick={() => {
                          setIsLogin(!isLogin);
                          setMessage({ type: '', text: '' });
                        }}
                        className="text-white font-semibold hover:underline transition-all"
                      >
                        {isLogin ? 'Register Now' : 'Login'}
                      </button>
                    </p>
                  </div>

                  {/* Footer Links */}
                  <div className="text-center mt-8">
                    <p className="text-teal-200 text-xs">
                      Terms and Services
                    </p>
                    <p className="text-teal-300 text-xs mt-2">
                      Have a problem? Contact us at{' '}
                      <a href="mailto:support@medibridge.com" className="underline hover:text-white">
                        support@medibridge.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}