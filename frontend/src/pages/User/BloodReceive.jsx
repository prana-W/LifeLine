import React, { useState } from "react";
import useApi from "@/hooks/useApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Siren, Droplet } from "lucide-react";

export default function BloodReceive() {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", text: "" });

  const triggerEmergency = async () => {
    setLoading(true);
    setAlert({ type: "", text: "" });

    const { success, message } = await api.post("/user/raiseBloodRequest", {});

    if (success) {
      setAlert({
        type: "success",
        text: "Emergency blood request raised successfully!"
      });
    } else {
      setAlert({
        type: "error",
        text: message || "Could not send request."
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 px-6 py-10 relative">

      {/* Soft floating background icon */}
      <Droplet
        className="absolute top-10 left-10 w-64 h-64 opacity-[0.06]"
        color="#ef4444"
        fill="#ef4444"
      />

      <Card
        className="w-full max-w-lg p-8 shadow-2xl border-none backdrop-blur-xl"
        style={{
          background: "rgba(255,255,255,0.8)",
          borderRadius: "22px"
        }}
      >
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-red-600 flex items-center justify-center gap-3">
            <Siren className="w-7 h-7 text-red-500 animate-pulse" />
            Blood Emergency
          </CardTitle>

          <p className="text-gray-600 mt-1">
            Instantly alert hospitals that you need blood.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* Alert Messages */}
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

          {/* Emergency Button */}
          <Button
            onClick={triggerEmergency}
            disabled={loading}
            className="w-full py-6 text-lg rounded-xl text-white shadow-md hover:shadow-xl transition-all hover:scale-[1.03]"
            style={{
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
            }}
          >
            {loading ? "Sending Emergency Signal..." : "Raise Blood Emergency"}
          </Button>

          <p className="text-xs text-gray-500 text-center mt-2">
            Your request will be sent to nearby hospitals instantly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
