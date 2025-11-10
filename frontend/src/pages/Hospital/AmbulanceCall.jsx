import React, { useState } from "react";
import useApi from "@/hooks/useApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Siren, AlertCircle, Ambulance } from "lucide-react";

export default function AmbulanceCall() {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", text: "" });

  const triggerAmbulance = async () => {
    setLoading(true);
    setAlert({ type: "", text: "" });

    const { success, message } = await api.post("/user/ambulance", {});

    if (success) {
      setAlert({
        type: "success",
        text: "Ambulance has been alerted successfully!"
      });
    } else {
      setAlert({
        type: "error",
        text: message || "Failed to request ambulance."
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-6 py-10 relative">

      {/* Soft Background Icon */}
      <Ambulance
        className="absolute top-12 left-12 w-64 h-64 opacity-[0.06]"
        color="#2563eb"
      />

      <Card
        className="w-full max-w-lg p-8 shadow-2xl border-none backdrop-blur-xl"
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          borderRadius: "22px",
        }}
      >
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-700 flex items-center justify-center gap-3">
            <Siren className="w-7 h-7 text-blue-600 animate-pulse" />
            Call Ambulance
          </CardTitle>

          <p className="text-gray-600 mt-1">
            Send instant ambulance request to the hospital.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          
          {/* Alert Box */}
          {alert.text && (
            <div
              className={`p-3 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                alert.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <AlertCircle className="w-5 h-5" />
              {alert.text}
            </div>
          )}

          {/* Main Button */}
          <Button
            onClick={triggerAmbulance}
            disabled={loading}
            className="w-full py-6 text-lg rounded-xl text-white shadow-md hover:shadow-xl transition-all hover:scale-[1.03]"
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            }}
          >
            {loading ? "Sending Request..." : "Request Ambulance"}
          </Button>

          <p className="text-xs text-gray-500 text-center mt-2">
            Your ambulance request will be delivered to the nearest available unit.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
