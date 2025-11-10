import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { Heart, Droplet, Calendar, Medal, MapPin, Phone, User, Activity } from "lucide-react";

export default function UserDonationPage() {

  // ✅ MODAL STATES
  const [donateModal, setDonateModal] = useState(false);
  const [learnModal, setLearnModal] = useState(false);

  const user = {
    name: "Ashutosh Rawat",
    phoneNumber: "9876543210",
    bloodType: "O+",
    location: "Lucknow",
    totalDonated: 1450,
    donations: [
      { date: "12 Jan 2025", qty: 450, hospital: "City Hospital" },
      { date: "06 Aug 2024", qty: 450, hospital: "Apollo Clinic" },
      { date: "14 Feb 2024", qty: 550, hospital: "Nirmal Care" }
    ]
  };

  const nextEligible = "12 March 2025";

  return (
    <div className="min-h-screen relative overflow-hidden 
                    bg-gradient-to-br from-[#fde3e3] via-[#fff0f0] to-[#fff5f5]">

      {/* Soft Grid Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="donor-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ff6b6b" strokeWidth="0.7" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#donor-grid)" />
        </svg>
      </div>

      {/* Floating Soft Blobs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-red-300/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-16 w-72 h-72 bg-red-400/30 rounded-full blur-3xl animate-ping" />
      <div className="absolute top-1/3 right-1/4 w-52 h-52 bg-pink-300/20 rounded-full blur-2xl animate-bounce" />

      {/* LEFT SIDE DECORATIVE CURVE WITH ICONS */}
      <div className="hidden lg:block absolute left-0 top-0 h-full w-32 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 1200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="leftGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff6b6b" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#ff8787" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ffa5a5" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path 
            d="M0,0 Q60,150 40,300 T50,600 Q70,750 40,900 T60,1200 L0,1200 Z" 
            fill="url(#leftGradient)"
            className="animate-[wave_8s_ease-in-out_infinite]"
          />
        </svg>
        
        <div className="absolute top-[15%] left-6 animate-[float_6s_ease-in-out_infinite]">
          <Heart className="w-10 h-10 text-red-400/60" fill="currentColor" />
        </div>
        <div className="absolute top-[35%] left-8 animate-[float_7s_ease-in-out_infinite_1s]">
          <Droplet className="w-8 h-8 text-red-500/50" fill="currentColor" />
        </div>
        <div className="absolute top-[55%] left-4 animate-[float_8s_ease-in-out_infinite_2s]">
          <Activity className="w-9 h-9 text-red-400/60" />
        </div>
        <div className="absolute top-[75%] left-7 animate-[float_6s_ease-in-out_infinite_1.5s]">
          <Heart className="w-7 h-7 text-pink-400/60" fill="currentColor" />
        </div>
      </div>

      {/* RIGHT SIDE DECORATIVE CURVE */}
      <div className="hidden lg:block absolute right-0 top-0 h-full w-32 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 1200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="rightGradient" x1="100%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffa5a5" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#ff8787" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ff6b6b" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path 
            d="M120,0 Q60,150 80,300 T70,600 Q50,750 80,900 T60,1200 L120,1200 Z" 
            fill="url(#rightGradient)"
            className="animate-[wave_8s_ease-in-out_infinite_reverse]"
          />
        </svg>
        
        <div className="absolute top-[20%] right-6 animate-[float_7s_ease-in-out_infinite_0.5s]">
          <Droplet className="w-9 h-9 text-red-500/60" fill="currentColor" />
        </div>
        <div className="absolute top-[40%] right-8 animate-[float_6s_ease-in-out_infinite_2s]">
          <Medal className="w-8 h-8 text-yellow-500/60" />
        </div>
        <div className="absolute top-[60%] right-5 animate-[float_8s_ease-in-out_infinite_1s]">
          <Heart className="w-10 h-10 text-pink-400/60" fill="currentColor" />
        </div>
        <div className="absolute top-[80%] right-7 animate-[float_7s_ease-in-out_infinite_2.5s]">
          <Activity className="w-8 h-8 text-red-400/60" />
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes wave {
          0%, 100% { transform: translateX(0px); }
          50% { transform: translateX(-10px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* HERO SECTION */}
      <section className="relative h-[500px] sm:h-[500px] w-full overflow-hidden rounded-[5px] shadow-2xl">
        <img
          src="/redblooddonation.png"
          alt="Blood Donation"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
        
        <div className="relative z-10 h-full flex flex-col justify-center pl-6 sm:pl-14 max-w-xl text-white">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight drop-shadow-lg">
            Donate Blood, Save Lives
          </h1>
          <p className="text-gray-200 mt-4 text-lg leading-relaxed max-w-lg drop-shadow-md">
            Your contribution can bring hope, strength, and a second chance.
            Track your donations and see your real impact.
          </p>
          <div className="flex gap-4 mt-6">
            
            {/* ✅ DONATE NOW BUTTON */}
            <button
              onClick={() => setDonateModal(true)}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-md transition-all hover:scale-105"
            >
              Donate Now
            </button>

            {/* ✅ LEARN MORE BUTTON */}
            <button
              onClick={() => setLearnModal(true)}
              className="px-6 py-2 border border-white/60 text-white font-semibold rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT (UNCHANGED) */}
      <div className="max-w-4xl w-full mx-auto px-4 py-10 flex flex-col gap-8 relative z-10">

        {/* your whole remaining UI stays EXACTLY the same */}

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-700 flex items-center justify-center gap-3">
            <Heart className="w-8 h-8 animate-pulse" fill="currentColor" />
            Your Donation Journey
          </h1>
          <p className="text-gray-700 mt-1">
            Track your impact, achievements, and upcoming donation dates
          </p>
        </div>

        {/* PROFILE + NEXT ELIGIBLE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Profile Card */}
          <Card className="bg-white/90 backdrop-blur-md shadow-xl border-red-200 hover:shadow-2xl transition-all hover:scale-[1.02]">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center gap-2">
                <User className="text-red-600" /> Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-gray-700">
              <p className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-50 transition-colors">
                <User className="h-5 w-5 text-red-500" /> 
                <span><b>Name:</b> {user.name}</span>
              </p>
              <p className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-50 transition-colors">
                <Phone className="h-5 w-5 text-red-500" /> 
                <span><b>Phone:</b> {user.phoneNumber}</span>
              </p>
              <p className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-50 transition-colors">
                <Droplet className="h-5 w-5 text-red-500" /> 
                <span><b>Blood Group:</b> {user.bloodType}</span>
              </p>
              <p className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-50 transition-colors">
                <MapPin className="h-5 w-5 text-red-500" /> 
                <span><b>Location:</b> {user.location}</span>
              </p>
            </CardContent>
          </Card>

          {/* Next Eligible */}
          <Card className="bg-white/90 backdrop-blur-md shadow-xl border-red-200 hover:shadow-2xl transition-all hover:scale-[1.02]">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center gap-2">
                <Calendar className="text-red-600" /> Next Eligible Donation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Calendar className="w-12 h-12 text-red-500 animate-pulse" />
                <div>
                  <p className="text-2xl font-bold text-red-600">{nextEligible}</p>
                  <p className="text-sm text-gray-600">You must wait 90 days between donations.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* STATS */}
        <Card className="shadow-xl border-red-200 bg-white/95 hover:shadow-2xl transition-all">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <Heart className="text-red-600 animate-pulse" fill="currentColor" /> Your Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-white hover:scale-105 transition-transform">
              <Droplet className="w-10 h-10 mx-auto mb-2 text-red-500" fill="currentColor" />
              <div className="text-4xl font-bold text-red-700">
                {(user.totalDonated / 1000).toFixed(1)} L
              </div>
              <p className="text-gray-600 font-medium">Total Donated</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-white hover:scale-105 transition-transform">
              <Heart className="w-10 h-10 mx-auto mb-2 text-red-500" fill="currentColor" />
              <div className="text-4xl font-bold text-red-700">
                {Math.ceil(user.totalDonated / 450) * 3}
              </div>
              <p className="text-gray-600 font-medium">Lives Saved</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-white hover:scale-105 transition-transform">
              <Activity className="w-10 h-10 mx-auto mb-2 text-red-500" />
              <div className="text-4xl font-bold text-red-700">{user.donations.length}</div>
              <p className="text-gray-600 font-medium">Total Donations</p>
            </div>
          </CardContent>
        </Card>

        {/* ACHIEVEMENTS */}
        <Card className="shadow-xl bg-white/95 border-red-200 hover:shadow-2xl transition-all">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <Medal className="text-red-600" /> Your Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4 flex-wrap">
            <span className="bg-yellow-100 text-yellow-700 px-5 py-3 rounded-xl font-semibold shadow-md hover:scale-110 transition-transform cursor-pointer">
              🥉 Bronze Donor
            </span>
            {user.donations.length >= 3 && (
              <span className="bg-gray-200 text-gray-700 px-5 py-3 rounded-xl font-semibold shadow-md hover:scale-110 transition-transform cursor-pointer">
                🥈 Silver Donor
              </span>
            )}
            {user.donations.length >= 5 && (
              <span className="bg-yellow-300 text-yellow-900 px-5 py-3 rounded-xl font-semibold shadow-md hover:scale-110 transition-transform cursor-pointer">
                🥇 Gold Donor
              </span>
            )}
          </CardContent>
        </Card>

        {/* DONATION HISTORY */}
        <Card className="shadow-xl border-red-200 bg-white/95 hover:shadow-2xl transition-all">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <Droplet className="text-red-600" fill="currentColor" /> Donation History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.donations.map((d, i) => (
              <div 
                key={i} 
                className="p-5 rounded-xl border-2 border-red-100 bg-gradient-to-r from-white to-red-50 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                <div className="flex justify-between items-center font-semibold">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-red-500" />
                    {d.date}
                  </span>
                  <span className="text-red-600 text-lg flex items-center gap-1">
                    <Droplet className="w-5 h-5" fill="currentColor" />
                    {d.qty} ml
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  Hospital: <b>{d.hospital}</b>
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ✅ DONATE NOW MODAL */}
      {donateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDonateModal(false)}
          />
          
          <div className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-6 shadow-2xl animate-[fadeIn_0.25s_ease]">
            <h2 className="text-2xl font-bold text-red-700 mb-3">
              Thank You for Your Initiative!
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Kindly visit your nearest hospital to donate blood.  
              Your step can save someone’s life today.
            </p>

            <button
              onClick={() => setDonateModal(false)}
              className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-semibold shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ✅ LEARN MORE MODAL */}
      {learnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setLearnModal(false)}
          />

          <div className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-6 shadow-2xl animate-[fadeIn_0.25s_ease]">
            <h2 className="text-2xl font-bold text-red-700 mb-3">
              Why Donate Blood?
            </h2>

            <ul className="list-disc pl-5 text-gray-700 leading-relaxed space-y-2">
              <li>One donation can save up to <b>three lives</b>.</li>
              <li>Your donated blood replenishes within 48 hours.</li>
              <li>Helps patients in accidents, surgeries, and cancer care.</li>
              <li>You become part of a life-saving community.</li>
            </ul>

            <button
              onClick={() => setLearnModal(false)}
              className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-semibold shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
