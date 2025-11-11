import React, { useState } from "react";
import useApi from "@/hooks/useApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Siren, Droplet, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function BloodReceive() {
    const api = useApi();
    const [isProcessing, setIsProcessing] = useState(false);
    const [alert, setAlert] = useState({ type: "", text: "" });

    // 📍 Fetch user geolocation + address details
    const getLocationData = async () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("Geolocation not supported"));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
                            { headers: { "User-Agent": "BloodEmergency/1.0" } }
                        );
                        const data = await response.json();
                        resolve({
                            latitude,
                            longitude,
                            pincode: data.address?.postcode || "Unknown",
                            city:
                                data.address?.city ||
                                data.address?.town ||
                                data.address?.village ||
                                "Unknown",
                            state: data.address?.state || "Unknown",
                            fullAddress: data.display_name,
                        });
                    } catch {
                        reject(new Error("Failed to fetch location details"));
                    }
                },
                () => reject(new Error("Failed to get location"))
            );
        });
    };

    // 🩸 Trigger a new blood emergency
    const triggerEmergency = async () => {
        setIsProcessing(true);
        setAlert({ type: "", text: "" });

        try {
            toast.info("Getting your location...");
            const locationData = await getLocationData();

            const { success, message, data } = await api.post(
                "/user/raiseBloodRequest",
                {
                    pincode: locationData.pincode,
                    latitude: locationData.latitude,
                    longitude: locationData.longitude,
                    location: locationData.fullAddress,
                    city: locationData.city,
                    state: locationData.state,
                }
            );

            if (success) {
                toast.success(
                    message || "Emergency blood request raised successfully!"
                );
                console.log(data)
                setAlert({
                    type: "success",
                    text: "Emergency blood request raised successfully!",
                });
            } else {
                toast.error(message || "Failed to raise blood request");
                setAlert({
                    type: "error",
                    text: message || "Failed to raise blood request",
                });
            }
        } catch (error) {
            console.error("❌ Blood request error:", error);
            toast.error(error.message || "Failed to raise blood emergency");
            setAlert({
                type: "error",
                text: error.message || "Failed to raise blood emergency",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 px-6 py-10 relative">
            {/* Decorative Background Droplet */}
            <Droplet
                className="absolute top-10 left-10 w-64 h-64 opacity-[0.06]"
                color="#ef4444"
                fill="#ef4444"
            />

            <Card
                className="w-full max-w-lg p-8 shadow-2xl border-none backdrop-blur-xl"
                style={{ background: "rgba(255,255,255,0.8)", borderRadius: "22px" }}
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
                        disabled={isProcessing}
                        className="
              w-full py-6 text-lg rounded-xl text-white shadow-md
              hover:shadow-xl transition-all hover:scale-[1.03]
            "
                        style={{
                            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                        }}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                Sending Blood Request...
                            </>
                        ) : (
                            <>
                                <Siren className="w-5 h-5 mr-2" />
                                Raise Blood Emergency
                            </>
                        )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center mt-2">
                        Your request will be sent to nearby hospitals instantly.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
