import React, { useCallback, useEffect, useState, useRef } from "react";
import { AlertTriangle, Clock, MapPin, PhoneCall, Activity } from "lucide-react";
import useApi from "@/hooks/useApi";

export default function HospitalDashboard() {
  const api = useApi();
  const apiRef = useRef(api);

  const [loading, setLoading] = useState(true);
  const [emergencies, setEmergencies] = useState([]);
  const [error, setError] = useState("");

  // Keep api ref updated
  useEffect(() => {
    apiRef.current = api;
  }, [api]);

  // Fetcher with stable reference
  const fetchEmergencies = useCallback(async (opts = { showSpinner: false }) => {
    try {
      if (opts.showSpinner) setLoading(true);
      const { data, success, message } = await apiRef.current.get("/hospital/getEmergency");
      if (!success) {
        setError(message || "Failed to load emergencies");
        setEmergencies([]);
      } else {
        setError("");
        setEmergencies(data?.alerts || []);
      }
    } catch (err) {
      setError("Network error fetching emergencies");
    } finally {
      if (opts.showSpinner) setLoading(false);
    }
  }, []); // No dependencies - stable function

  // Initial load + poll every 10s
  useEffect(() => {
    // Initial fetch with spinner
    fetchEmergencies({ showSpinner: true });

    // Subsequent silent polling every 10 seconds
    const intervalId = setInterval(() => {
      fetchEmergencies({ showSpinner: false });
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchEmergencies]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F766E] via-[#0E7490] to-[#134E4A] text-white p-8">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <Activity className="w-10 h-10" />
          Hospital Dashboard
        </h1>

        <button
          className="px-5 py-2 bg-white text-teal-700 rounded-xl shadow-md font-semibold hover:bg-gray-100"
          onClick={() => fetchEmergencies({ showSpinner: true })}
        >
          Refresh
        </button>
      </div>

      {/* EMERGENCY SECTION */}
      <section className="mb-14">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
          <AlertTriangle className="w-7 h-7 text-red-300" />
          Active Emergencies
        </h2>

        {/* Loading */}
        {loading && (
          <p className="text-lg text-teal-100">Loading emergency data...</p>
        )}

        {/* Error */}
        {!loading && error && (
          <p className="text-red-200 bg-red-500/20 p-3 rounded-lg max-w-xl">
            {error}
          </p>
        )}

        {/* No emergencies */}
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
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-red-400 w-8 h-8" />
                <h3 className="text-xl font-semibold">Emergency Alert</h3>
              </div>

              <p className="text-teal-100 mb-3 text-sm">
                {alert.description || "No description provided."}
              </p>

              <div className="space-y-2 text-white/80">
                <p className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{alert.location || "Unknown location"}</span>
                </p>

                <p className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>
                    {alert.createdAt
                      ? new Date(alert.createdAt).toLocaleString()
                      : "Time not available"}
                  </span>
                </p>

                <p className="flex items-center gap-2">
                  <PhoneCall className="w-5 h-5" />
                  <span>{alert.userPhone || "N/A"}</span>
                </p>
              </div>

              <button className="mt-5 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition">
                Respond Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-teal-200 text-sm mt-20">
        © 2025 MediBridge Hospital Network
      </footer>
    </div>
  );
}