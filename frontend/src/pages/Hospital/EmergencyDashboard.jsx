import React, { useCallback, useEffect, useState, useRef } from "react";
import {
    AlertTriangle,
    Clock,
    MapPin,
    PhoneCall,
    Activity,
    CheckCircle2,
    Droplets,
    User,
    Hospital,
    CheckCircle,
    Map,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useApi from "@/hooks/useApi";

export default function EmergencyDashboard() {
    const api = useApi();
    const apiRef = useRef(api);

    const [loading, setLoading] = useState(true);
    const [emergencies, setEmergencies] = useState([]);
    const [error, setError] = useState("");

    // Keep api ref synced
    useEffect(() => {
        apiRef.current = api;
    }, [api]);

    const fetchEmergencies = useCallback(async (opts = { showSpinner: false }) => {
        try {
            if (opts.showSpinner) setLoading(true);
            const { success, data, message } = await apiRef.current.get("/hospital/getEmergency");

            if (!success) {
                setError(message || "Failed to fetch emergencies");
                setEmergencies([]);
            } else {
                setError("");
                setEmergencies(data || []);
            }
        } catch (err) {
            setError("Network error fetching emergencies");
        } finally {
            if (opts.showSpinner) setLoading(false);
        }
    }, []);

    const handleSolve = async (id) => {
        const { success } = await apiRef.current.put(`/hospital/solveEmergency/${id}`, {});
        if (success) {
            // toast.success("Emergency marked as solved!");
            // Move to resolved locally
            setEmergencies((prev) =>
                prev.map((e) =>
                    e._id === id ? { ...e, status: "resolved", resolvedAt: new Date().toISOString() } : e
                )
            );
        } else {
            toast.error("Failed to solve emergency");
        }
    };

    const handleDelete = async (id) => {
        const { success } = await apiRef.current.delete(`/hospital/deleteEmergency/${id}`);
        if (success) {
            toast.success("Emergency was deleted!");
            setEmergencies((prev) => prev.filter((e) => e._id !== id));
        } else {
            toast.error("Failed to delete emergency");
        }
    };

    // 🗺️ Open Google Maps with lat/long
    const handleShowLocation = (latitude, longitude) => {
        if (!latitude || !longitude) {
            toast.error("Location data not available.");
            return;
        }
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        window.open(mapsUrl, "_blank");
    };

    useEffect(() => {
        fetchEmergencies({ showSpinner: true });
        const intervalId = setInterval(() => fetchEmergencies(), 10000);
        return () => clearInterval(intervalId);
    }, [fetchEmergencies]);

    // Separate Active and Resolved
    const activeEmergencies = emergencies.filter((e) => e.status !== "resolved");
    const resolvedEmergencies = emergencies.filter((e) => e.status === "resolved");

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0F766E] via-[#0E7490] to-[#134E4A] text-white p-8">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-10">
                <h1 className="text-4xl font-bold flex items-center gap-3">
                    <Activity className="w-10 h-10" />
                    Hospital Dashboard
                </h1>

                <Button
                    onClick={() => fetchEmergencies({ showSpinner: true })}
                    className="bg-white text-teal-700 font-semibold hover:bg-gray-100 px-5 py-2 rounded-xl shadow"
                >
                    Refresh
                </Button>
            </div>

            {/* ACTIVE EMERGENCIES */}
            <section className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-7 h-7 text-red-300" />
                    <h2 className="text-2xl font-semibold">Active Emergencies</h2>
                    {!loading && (
                        <span className="ml-2 text-sm bg-white/15 px-2 py-0.5 rounded-md">
              {activeEmergencies.length}
            </span>
                    )}
                </div>

                {loading && <p className="text-lg text-teal-100">Loading emergency data...</p>}

                {!loading && error && (
                    <p className="text-red-200 bg-red-500/20 p-3 rounded-lg max-w-xl">{error}</p>
                )}

                {!loading && !error && activeEmergencies.length === 0 && (
                    <p className="text-teal-100 text-lg">No active emergency alerts.</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                    {activeEmergencies.map((alert) => (
                        <div
                            key={alert._id}
                            className="bg-white/15 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-xl hover:scale-[1.02] transition"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="text-red-400 w-8 h-8" />
                                    <h3 className="text-xl font-semibold">Emergency Alert</h3>
                                </div>

                                <div className="flex flex-col items-end gap-1">
                                    {/* Type Tag */}
                                    <span
                                        className={`text-xs px-2 py-1 rounded capitalize ${
                                            alert.type === "ambulance"
                                                ? "bg-blue-400/20 text-blue-100"
                                                : alert.type === "blood"
                                                    ? "bg-pink-400/20 text-pink-100"
                                                    : "bg-orange-400/20 text-orange-100"
                                        }`}
                                    >
          {alert.type}
        </span>
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="space-y-2 mb-4 text-white/90">
                                <p className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    <span>{alert.user?.name || "Unknown User"}</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <PhoneCall className="w-5 h-5" />
                                    <span>{alert.user?.phoneNumber || "N/A"}</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Droplets className="w-5 h-5" />
                                    <span>{alert.user?.bloodType || "N/A"}</span>
                                </p>
                            </div>

                            {/* Location Info */}
                            <div className="space-y-2 text-white/80 mb-4">
                                <p className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    <span>{alert.location?.address || "Unknown location"}</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Hospital className="w-5 h-5" />
                                    <span>
          Notified Hospitals:{" "}
                                        {alert.hospitalsNotified?.length
                                            ? alert.hospitalsNotified.length
                                            : "None"}
        </span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    <span>
          {alert.createdAt
              ? new Date(alert.createdAt).toLocaleString()
              : "Time not available"}
        </span>
                                </p>
                            </div>

                            {/* MEDIA / TYPE DISPLAY */}
                            {alert.type === "ambulance" ? (
                                // 🏥 Ambulance Emergency
                                alert.location?.latitude && alert.location?.longitude ? (
                                    <iframe
                                        title="User Live Location"
                                        width="100%"
                                        height="240"
                                        className="rounded-lg border border-white/20 shadow-md"
                                        src={`https://www.google.com/maps?q=${alert.location.latitude},${alert.location.longitude}&z=15&output=embed`}
                                        allowFullScreen
                                        loading="lazy"
                                    ></iframe>
                                ) : (
                                    <p className="text-white/70 italic">Location data unavailable.</p>
                                )
                            ) : alert.type === "blood" ? (
                                // 🩸 Blood Emergency
                                <div className="flex flex-col items-center justify-center h-48 border border-pink-400/30 rounded-lg bg-pink-500/10">
                                    <p className="text-7xl font-extrabold text-pink-300 drop-shadow-lg">
                                        {alert.user?.bloodType || "N/A"}
                                    </p>
                                    <p className="text-sm text-white/70 mt-2">Blood Group Needed</p>
                                </div>
                            ) : alert.audioVideoUrl ? (
                                // 🎥 Generic Emergency
                                <video
                                    src={`${import.meta.env.VITE_SERVER_BASE_URL}${alert.audioVideoUrl}`}
                                    controls
                                    className="w-full aspect-video max-h-64 object-cover rounded-lg border border-white/20 shadow-md"
                                />
                            ) : (
                                <p className="text-white/70 italic">No media available.</p>
                            )}

                            {/* ACTIONS */}
                            <div className="flex flex-col sm:flex-row items-center justify-between mt-5 gap-3">
                                {alert.type === "ambulance" ? (
                                    <Button
                                        onClick={() => {
                                            handleSolve(alert._id);
                                            toast.success("Ambulance has been assigned and sent to the location!");
                                        }}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
                                    >
                                        🚑 Assign Ambulance
                                    </Button>
                                ) : alert.type === "blood" ? (
                                    <Button
                                        onClick={() => {
                                            handleSolve(alert._id);
                                            toast.success("Blood unit preparation has started!");
                                        }}
                                        className="bg-pink-600 hover:bg-pink-700 text-white flex items-center gap-2"
                                    >
                                        🩸 Start Preparing
                                    </Button>
                                ) : (
                                    // Default solve option for other emergencies
                                    <label className="flex items-center gap-2 text-white font-semibold">
                                        <input
                                            type="checkbox"
                                            className="scale-125 accent-green-500"
                                            onChange={
                                            () => {
                                                handleSolve(alert._id);
                                                toast.success("Emergency was marked as solved!");
                                            }

                                        }
                                        />
                                        Mark as Solved
                                    </label>
                                )}

                                {/* Delete Button */}
                                <Button
                                    onClick={() => handleDelete(alert._id)}
                                    className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                                >
                                    <CheckCircle2 className="w-5 h-5" /> Delete
                                </Button>
                            </div>
                        </div>
                    ))}


                </div>
            </section>

            {/* RESOLVED EMERGENCIES */}
            <section>
                <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-7 h-7 text-emerald-300" />
                    <h2 className="text-2xl font-semibold">Resolved Emergencies</h2>
                    {!loading && (
                        <span className="ml-2 text-sm bg-white/15 px-2 py-0.5 rounded-md">
              {resolvedEmergencies.length}
            </span>
                    )}
                </div>

                {!loading && !error && resolvedEmergencies.length === 0 && (
                    <p className="text-teal-100 text-lg">No resolved emergencies yet.</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                    {resolvedEmergencies.map((alert) => (
                        <div
                            key={alert._id}
                            className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-xl"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="text-emerald-300 w-7 h-7" />
                                    <h3 className="text-xl font-semibold">Resolved Emergency</h3>
                                </div>
                                <span className="text-xs bg-emerald-400/20 text-emerald-100 px-2 py-1 rounded">
                  resolved
                </span>
                            </div>

                            <div className="space-y-2 mb-4 text-white/90">
                                <p className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    <span>{alert.user?.name || "Unknown User"}</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <PhoneCall className="w-5 h-5" />
                                    <span>{alert.user?.phoneNumber || "N/A"}</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Droplets className="w-5 h-5" />
                                    <span>{alert.user?.bloodType || "N/A"}</span>
                                </p>
                            </div>

                            <div className="space-y-2 text-white/80">
                                <p className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    <span>{alert.location?.address || "Unknown location"}</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    <span>
                    Reported:{" "}
                                        {alert.createdAt
                                            ? new Date(alert.createdAt).toLocaleString()
                                            : "Unknown"}
                  </span>
                                </p>
                                {alert.resolvedAt && (
                                    <p className="flex items-center gap-2">
                                        <Clock className="w-5 h-5" />
                                        <span>Resolved: {new Date(alert.resolvedAt).toLocaleString()}</span>
                                    </p>
                                )}
                            </div>

                            <p className="mt-4 text-white/70 italic">
                                Media is hidden for resolved emergencies.
                            </p>

                            <div className="flex items-center justify-end mt-5">
                                <Button
                                    onClick={() => handleDelete(alert._id)}
                                    className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                                >
                                    <CheckCircle2 className="w-5 h-5" /> Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
