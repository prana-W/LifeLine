import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { Heart, Droplet, Calendar, Medal, MapPin, Phone, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import  useApi  from "@/hooks/useApi";

export default function UserDonationPage() {

  const api=useApi();

  // -------------------------------
  // MOCK DATA (replace with backend)
  // -------------------------------
  const user = {
    name: "Ashutosh Rawat",
    phoneNumber: "9876543210",
    bloodType: "O+",
    location: "Lucknow",
    totalDonated: 1450,        // in ml
    donations: [
      { date: "12 Jan 2025", qty: 450, hospital: "City Hospital" },
      { date: "06 Aug 2024", qty: 450, hospital: "Apollo Clinic" },
      { date: "14 Feb 2024", qty: 550, hospital: "Nirmal Care" }
    ]
  };

  const nextEligible = "12 March 2025";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fde3e3] to-[#fff5f5] py-10 px-4 flex justify-center">

      <div className="max-w-4xl w-full flex flex-col gap-8">

        {/* ------------------ HEADER ------------------ */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-700">Your Donation Journey</h1>
          <p className="text-gray-700 mt-1">Track your impact, achievements, and upcoming donation dates</p>
        </div>

        {/* ------------------ PROFILE + NEXT ELIGIBLE ------------------ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Profile */}
          <Card className="backdrop-blur-md bg-white/80 shadow-lg border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center gap-2">
                <User className="text-red-600" /> Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-gray-700">

              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-red-500" />
                <span><b>Name:</b> {user.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-red-500" />
                <span><b>Phone:</b> {user.phoneNumber}</span>
              </div>

              <div className="flex items-center gap-2">
                <Droplet className="h-5 w-5 text-red-500" />
                <span><b>Blood Group:</b> {user.bloodType}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-500" />
                <span><b>Location:</b> {user.location}</span>
              </div>

            </CardContent>
          </Card>

          {/* Next Eligible */}
          <Card className="shadow-lg bg-white/80 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center gap-2">
                <Calendar className="text-red-600" /> Next Eligible Donation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 font-medium">
              <p className="text-xl text-red-600">{nextEligible}</p>
              <p className="text-sm opacity-70">You must wait at least 90 days between donations.</p>
            </CardContent>
          </Card>

        </div>

        {/* ------------------ STATS ------------------ */}
        <Card className="shadow-xl border-red-200 bg-white/90">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <Heart className="text-red-600" /> Your Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">

            <div>
              <div className="text-3xl font-extrabold text-red-700">
                {(user.totalDonated / 1000).toFixed(1)} L
              </div>
              <p className="text-gray-700">Total Blood Donated</p>
            </div>

            <div>
              <div className="text-3xl font-extrabold text-red-700">
                {Math.ceil(user.totalDonated / 450) * 3}
              </div>
              <p className="text-gray-700">Estimated Lives Saved</p>
            </div>

            <div>
              <div className="text-3xl font-extrabold text-red-700">
                {user.donations.length}
              </div>
              <p className="text-gray-700">Total Donations</p>
            </div>

          </CardContent>
        </Card>

        {/* ------------------ BADGES ------------------ */}
        <Card className="shadow-lg bg-white/90 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <Medal className="text-red-600" /> Your Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4 flex-wrap">

            <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl font-semibold flex items-center gap-2 shadow">
              🥉 Bronze Donor
            </span>

            {user.donations.length >= 3 && (
              <span className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-semibold flex items-center gap-2 shadow">
                🥈 Silver Donor
              </span>
            )}

            {user.donations.length >= 5 && (
              <span className="bg-yellow-300 text-yellow-900 px-4 py-2 rounded-xl font-semibold flex items-center gap-2 shadow">
                🥇 Gold Donor
              </span>
            )}

          </CardContent>
        </Card>

        {/* ------------------ DONATION HISTORY ------------------ */}
        <Card className="shadow-xl border-red-200 bg-white/95">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <Droplet className="text-red-600" /> Donation History
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            {user.donations.map((d, index) => (
              <div key={index} className="p-4 rounded-xl border bg-white/70 shadow-sm">
                <div className="flex justify-between font-semibold">
                  <span>{d.date}</span>
                  <span className="text-red-600">{d.qty} ml</span>
                </div>
                <p className="text-sm text-gray-700 mt-1">
                  Hospital: <b>{d.hospital}</b>
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
