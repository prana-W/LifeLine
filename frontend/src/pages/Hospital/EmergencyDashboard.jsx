import React, { useCallback, useEffect, useState, useRef } from "react";
import {
    AlertTriangle,
    Clock,
    MapPin,
    PhoneCall,
    Activity,
    CheckCircle2,
    PlayCircle,
    Droplets,
    User,
    Hospital,
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
        const { success } = await apiRef.current.post(`/hospital/emergency/${id}`, {});
        if (success) {
            toast.success("Emergency marked as solved!");
            setEmergencies((prev) => prev.filter((e) => e._id !== id));
        } else {
            toast.error("Failed to delete emergency");
        }
    };

    const handleDelete = async (id) => {
        const { success } = await apiRef.current.delete(`/hospital/emergency/${id}`);
        if (success) {
            toast.success("Emergency marked as solved!");
            setEmergencies((prev) => prev.filter((e) => e._id !== id));
        } else {
            toast.error("Failed to delete emergency");
        }
    };


    useEffect(() => {
        fetchEmergencies({ showSpinner: true });
        const intervalId = setInterval(() => fetchEmergencies(), 10000); // 10s refresh
        return () => clearInterval(intervalId);
    }, [fetchEmergencies]);

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

            {/* EMERGENCY LIST */}
            <section>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                    <AlertTriangle className="w-7 h-7 text-red-300" />
                    Active Emergencies
                </h2>

                {/* Loading State */}
                {loading && <p className="text-lg text-teal-100">Loading emergency data...</p>}

                {/* Error */}
                {!loading && error && (
                    <p className="text-red-200 bg-red-500/20 p-3 rounded-lg max-w-xl">{error}</p>
                )}

                {/* No Data */}
                {!loading && !error && emergencies.length === 0 && (
                    <p className="text-teal-100 text-lg">No emergency alerts at the moment.</p>
                )}

                {/* Emergency Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                    {emergencies.map((alert) => (
                        <div
                            key={alert._id}
                            className="bg-white/15 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-xl hover:scale-[1.02] transition"
                        >
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <AlertTriangle className="text-red-400 w-8 h-8" />
                                <h3 className="text-xl font-semibold">Emergency Alert</h3>
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

                            {/* Audio/Video Evidence */}
                            {alert.audioVideoUrl && (
                                <video
                                    src={`${import.meta.env.VITE_SERVER_BASE_URL}${alert.audioVideoUrl}`}
                                    controls
                                    className="w-full aspect-video max-h-64 object-cover rounded-lg border border-white/20 shadow-md"
                                />

                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-between mt-5">
                                <label className="flex items-center gap-2 text-white font-semibold">
                                    <input
                                        type="checkbox"
                                        className="scale-125 accent-green-500"
                                        onChange={() => handleSolve(alert._id)}
                                    />
                                    Mark as solved
                                </label>

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
