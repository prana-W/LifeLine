import React, { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
    Heart,
    Droplet,
    Calendar,
    Medal,
    MapPin,
    Phone,
    User,
    Activity
} from "lucide-react";

export default function UserDonationPage() {
    const [donateModal, setDonateModal] = useState(false);
    const [learnModal, setLearnModal] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const nextEligible = "12 March 2025"; // Could be computed from backend later

    // ✅ Fetch user data from backend
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/user`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });

                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text || "Failed to fetch user data");
                }

                const data = await res.json();
                setUser(data.data || data); // handles { data: {..} } or plain object
            } catch (err) {
                console.error("❌ Error fetching user data:", err);
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // ✅ Loading or error states
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fde3e3] via-[#fff0f0] to-[#fff5f5]">
                <p className="text-red-600 font-semibold text-lg animate-pulse">Loading user data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#fde3e3] via-[#fff0f0] to-[#fff5f5] text-center">
                <p className="text-red-600 font-semibold text-lg mb-4">{error}</p>
                <button
                    onClick={() => navigate("/user/auth")}
                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-md transition-all hover:scale-105"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#fde3e3] via-[#fff0f0] to-[#fff5f5]">

            {/* ✅ HERO SECTION */}
            <section className="relative h-[500px] w-full overflow-hidden rounded-[5px] shadow-2xl">
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

                    <div className="flex flex-wrap gap-4 mt-6">
                        <button
                            onClick={() => setDonateModal(true)}
                            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-md transition-all hover:scale-105"
                        >
                            Donate Now
                        </button>

                        <button
                            onClick={() => navigate("/user/receiveBlood")}
                            className="px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl shadow-md transition-all hover:scale-105"
                        >
                            Receive Blood
                        </button>

                        <button
                            onClick={() => setLearnModal(true)}
                            className="px-6 py-2 border border-white/60 text-white font-semibold rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all"
                        >
                            Learn More
                        </button>
                    </div>
                </div>
            </section>

            {/* ✅ USER CONTENT */}
            <div className="max-w-4xl w-full mx-auto px-4 py-10 flex flex-col gap-8 relative z-10">
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
                    <Card className="bg-white/90 shadow-xl border-red-200 hover:shadow-2xl transition-all hover:scale-[1.02]">
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
                    <Card className="bg-white/90 shadow-xl border-red-200 hover:shadow-2xl transition-all hover:scale-[1.02]">
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

                {/* DONATION HISTORY */}
                {user.donations && user.donations.length > 0 && (
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
                )}
            </div>

            {/* ✅ DONATE + LEARN MODALS */}
            {donateModal && (
                <Modal title="Thank You for Your Initiative!" onClose={() => setDonateModal(false)}>
                    Kindly visit your nearest hospital to donate blood.
                    Your step can save someone’s life today.
                </Modal>
            )}

            {learnModal && (
                <Modal title="Why Donate Blood?" onClose={() => setLearnModal(false)}>
                    <ul className="list-disc pl-5 text-gray-700 leading-relaxed space-y-2">
                        <li>One donation can save up to <b>three lives</b>.</li>
                        <li>Your donated blood replenishes within 48 hours.</li>
                        <li>Helps patients in accidents, surgeries, and cancer care.</li>
                        <li>You become part of a life-saving community.</li>
                    </ul>
                </Modal>
            )}
        </div>
    );
}

/* ✅ Reusable Modal Component */
function Modal({ title, children, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl p-8 max-w-md w-full mx-6 shadow-2xl animate-[fadeIn_0.25s_ease]">
                <h2 className="text-2xl font-bold text-red-700 mb-3">{title}</h2>
                <div className="text-gray-700">{children}</div>
                <button
                    onClick={onClose}
                    className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-semibold shadow-lg"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
