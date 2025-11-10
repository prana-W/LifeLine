import React, { useState, useEffect } from "react";
import useApi from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Clock, Siren, AlertCircle } from "lucide-react";

export default function AmbulanceButton() {
  const api = useApi();

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", text: "" });
  const [eta, setEta] = useState(null);          // ETA in minutes
  const [countdown, setCountdown] = useState(null); // Seconds left

  // Timer effect
  useEffect(() => {
    if (!countdown || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Convert seconds to mm:ss
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const triggerAmbulance = async () => {
    setLoading(true);
    setAlert({ type: "", text: "" });

    const { success, message } = await api.post("/user/ambulance", {});

    if (success) {
      setAlert({
        type: "success",
        text: "Ambulance request sent!"
      });

      const randomETA = Math.floor(Math.random() * 20) + 10; // 10–30 minutes
      setEta(randomETA);
      setCountdown(randomETA * 60);
    } else {
      setAlert({
        type: "error",
        text: message || "Failed to request ambulance."
      });
    }

    setLoading(false);
  };

  return (
    <>
      {/* MAIN BUTTON (simple component) */}
      <Button
        onClick={triggerAmbulance}
        disabled={loading}
        className="flex items-center gap-2 px-6 py-4 text-white rounded-xl shadow-lg hover:scale-[1.02]"
        style={{
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
        }}
      >
        <Siren className="w-5 h-5 animate-pulse" />
        {loading ? "Requesting..." : "Call Ambulance"}
      </Button>

      {/* ALERT BOX */}
      {alert.text && (
        <div
          className={`fixed bottom-8 right-8 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 text-sm ${
            alert.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          <AlertCircle className="w-5 h-5" />
          {alert.text}
        </div>
      )}

      {/* FLOATING ETA TIMER POPUP */}
      {countdown > 0 && (
        <div className="fixed top-8 right-8 z-50 bg-white shadow-2xl border border-blue-200 rounded-xl p-5 w-60 animate-[fadeIn_0.3s_ease-out]">
          <div className="flex items-center gap-3">
            <Clock className="w-10 h-10 text-blue-600 animate-spin-slow" />
            <div>
              <p className="text-xs text-gray-500 uppercase">Ambulance ETA</p>
              <p className="text-3xl font-bold text-blue-700">
                {formatTime(countdown)}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-1000"
              style={{
                width: `${((eta * 60 - countdown) / (eta * 60)) * 100}%`
              }}
            />
          </div>
        </div>
      )}

      {/* Timer animation keyframes */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 4s linear infinite;
          }
        `}
      </style>
    </>
  );
}
