import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Phone, User, MapPin, Droplet, Locate, Activity, Heart, Syringe } from "lucide-react";
import { toast } from "sonner";
import FancySearchBar from "../../components/general/SearchBar";
import useApi from "@/hooks/useApi";

export default function BloodDonation() {
  const api = useApi();

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(null);

  const [donationQty, setDonationQty] = useState("");
  const [receivedQty, setReceivedQty] = useState("");

  const [message, setMessage] = useState({ type: "", text: "" });

  // -----------------------------------
  // ✅ FETCH USER
  // -----------------------------------
  const handleFetchUser = async () => {
    if (!phone.trim()) return toast.error("Enter phone number!");
    
    setLoading(true);
    setMessage({ type: "", text: "" });
    
    try {
      const { success, data, message } = await api.get(`/user/${phone}`);
      
      if (success) {
        setUser(data);
        
        toast.success("User found!", {
          duration: 1200,
          className: "bg-green-500 text-white font-semibold",
        });
      } else {
        setUser(null);
        setMessage({ type: "error", text: message || "User not found!" });
        
        toast.error("User not found!", {
          duration: 1300,
          className: "bg-red-500 text-white",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Try again." });
      
      toast.error("Network error!", {
        duration: 1200,
      });
    } finally {
      setLoading(false);
    }
  };
  
  // -----------------------------------
  // ✅ SAVE BLOOD DONATION
  // -----------------------------------
  const handleDonationSubmit = async () => {
    if (!donationQty.trim()) return toast.error("Enter donated quantity!");
    
    const payload = {
      donorId: user._id,
      quantity: Number(donationQty),
    };
    
    try {
      const { success, message } = await api.post(
        "/hospital/addBloodDonation",
        payload
      );
      
      if (success) {
        toast.success("Donation recorded!", {
          duration: 1400,
          className: "bg-green-600 text-white font-semibold",
        });
        setDonationQty("");
      } else {
        toast.error(message || "Failed to save donation");
      }
    } catch (err) {
      toast.error(err?.message || "Network error");
    }
  };

  // -----------------------------------
  // ✅ SAVE BLOOD RECEIVED
  // -----------------------------------
  const handleReceiveSubmit = async () => {
    if (!receivedQty.trim()) return toast.error("Enter received quantity!");
    
    const payload = {
      receiverId: user._id,
      quantity: Number(receivedQty),
    };
    
    try {
      const { success, message } = await api.post(
        "/hospital/giveBloodDonation",
        payload
      );
      
      if (success) {
        toast.success("Receive entry saved!", {
          duration: 1400,
          className: "bg-blue-600 text-white font-semibold",
        });
        setReceivedQty("");
      } else {
        toast.error(message || "Failed to record receive entry");
      }
    } catch (err) {
      toast.error(err?.message || "Network error");
    }
  };
  
  return (
    <div
    className="min-h-screen flex items-center justify-center relative p-6 overflow-hidden"
    style={{
      background:
      "linear-gradient(135deg, rgba(74,144,226,0.08), rgba(74,210,204,0.08))",
    }}
    
    >
      {/* ✅ LIGHT GRID (subtle + matching footer blue) */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(74,144,226,0.28)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* ✅ DECORATIVE MEDICAL ICONS - LEFT SIDE */}
      <div className="absolute left-0 top-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Giant Stethoscope SVG - Left Top */}
        <svg 
          className="absolute -left-20 top-10 opacity-[0.08] animate-[float_8s_ease-in-out_infinite]"
          width="400" 
          height="400" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#4A90E2" 
          strokeWidth="0.5"
        >
          <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
          <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
          <circle cx="20" cy="10" r="2" />
        </svg>

        {/* Blood Drop - Left Middle */}
        <Droplet 
          className="absolute left-10 top-1/3 opacity-[0.06] animate-[float_6s_ease-in-out_infinite_1s]"
          size={280}
          fill="#FF6B6B"
          color="#FF6B6B"
        />

        {/* Heart Monitor - Left Bottom */}
        <Activity 
          className="absolute left-5 bottom-20 opacity-[0.07] animate-[float_7s_ease-in-out_infinite_2s]"
          size={320}
          color="#4AD2CC"
        />

        {/* Syringe SVG - Left Bottom Corner */}
        <svg
          className="absolute left-20 bottom-10 opacity-[0.08] animate-[float_9s_ease-in-out_infinite_1.5s]"
          width="350"
          height="350"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4A90E2"
          strokeWidth="0.5"
        >
          <path d="m18 2 4 4" />
          <path d="m17 7 3-3" />
          <path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" />
          <path d="m9 11 4 4" />
          <path d="m5 19-3 3" />
          <path d="m14 4 6 6" />
        </svg>
      </div>

      {/* ✅ DECORATIVE MEDICAL ICONS - RIGHT SIDE */}
      <div className="absolute right-0 top-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Giant Heart - Right Top */}
        <Heart 
          className="absolute -right-16 top-16 opacity-[0.06] animate-[float_7s_ease-in-out_infinite_0.5s]"
          size={350}
          fill="#FF6B6B"
          color="#FF6B6B"
        />

        {/* Medical Cross SVG - Right Middle */}
        <svg
          className="absolute right-10 top-1/2 opacity-[0.07] animate-[float_8s_ease-in-out_infinite_2.5s]"
          width="300"
          height="300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4AD2CC"
          strokeWidth="0.5"
        >
          <path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z" />
        </svg>

        {/* Pill/Capsule - Right Bottom */}
        <svg
          className="absolute right-16 bottom-24 opacity-[0.08] animate-[float_6s_ease-in-out_infinite_1s]"
          width="280"
          height="280"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4A90E2"
          strokeWidth="0.5"
        >
          <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
          <path d="m8.5 8.5 7 7" />
        </svg>

        {/* Blood Bag Icon - Right Far Right */}
        <Droplet 
          className="absolute -right-10 top-2/3 opacity-[0.06] animate-[float_7s_ease-in-out_infinite_2s]"
          size={260}
          fill="#4AD2CC"
          color="#4AD2CC"
        />
      </div>

      {/* Floating Animation Keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(3deg); }
        }
      `}</style>

      {/* ✅ MAIN CARD */}
      <Card
        className="max-w-2xl w-full shadow-2xl border-none relative z-10 p-4"
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(16px)",
          borderRadius: "20px",
        }}
      >
        <CardHeader>
          <CardTitle
            className="text-3xl font-bold text-center flex items-center justify-center gap-3"
            style={{ color: "#0E2A47" }}
          >
            <Activity className="w-8 h-8" style={{ color: "#4A90E2" }} />
            Blood Management
          </CardTitle>
          <CardDescription
            className="text-center"
            style={{ color: "#3A5A7A" }}
          >
            Add donation or receiving details
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* ✅ ALERT */}
          {message.text && (
            <Alert
              className={`border-none ${
                message.type === "success" ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <AlertDescription
                className={`font-medium ${
                  message.type === "success"
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          {/* ✅ SEARCH USER */}
          <div className="space-y-2">
            <Label className="font-semibold" style={{ color: "#0E2A47" }}>
              Enter User Phone Number
            </Label>

            <div className="w-full flex justify-center">
              <FancySearchBar
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* ✅ Search Button (footer theme) */}
          <Button
            className="w-full text-white py-3 text-lg shadow-md hover:shadow-xl transition-all hover:scale-[1.02]"
            style={{
              background:
                "linear-gradient(135deg, #4A90E2 0%, #4AD2CC 100%)",
            }}
            onClick={handleFetchUser}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search User"}
          </Button>

          {/* ✅ USER INFO CARD */}
          {user && (
            <Card
              className="mt-6 shadow-lg border hover:shadow-xl transition-all"
              style={{
                background: "rgba(255,255,255,0.75)",
                borderColor: "rgba(74,144,226,0.3)",
              }}
            >
              <CardHeader>
                <CardTitle
                  className="text-xl font-bold flex items-center gap-2"
                  style={{ color: "#0E2A47" }}
                >
                  <User style={{ color: "#4A90E2" }} /> {user.name}
                </CardTitle>
                <CardDescription style={{ color: "#4A90E2" }}>
                  User Details
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 text-blue-900">
                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                  <Phone className="h-5 w-5" style={{ color: "#4A90E2" }} />
                  <span>
                    <b>Phone:</b> {user.phoneNumber}
                  </span>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                  <MapPin className="h-5 w-5" style={{ color: "#4A90E2" }} />
                  <span>
                    <b>Pin Code:</b> {user.pinCode}
                  </span>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                  <Locate className="h-5 w-5" style={{ color: "#4A90E2" }} />
                  <span>
                    <b>Location:</b> {user.location || "Not Provided"}
                  </span>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-red-50 transition-colors">
                  <Droplet className="h-5 w-5" style={{ color: "#FF6B6B" }} />
                  <span>
                    <b>Blood Type:</b> {user.bloodType}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ✅ DONATION + RECEIVING */}
          {user && (
            <div className="mt-6 space-y-10">
              {/* ✅ Donation */}
              <div className="space-y-3">
                <Label
                  className="font-semibold flex items-center gap-2"
                  style={{ color: "#0E2A47" }}
                >
                  <Droplet className="h-5 w-5" style={{ color: "#FF6B6B" }} />
                  {user.name} has DONATED blood
                </Label>

                <Input
                  type="number"
                  className="py-6 transition-all focus:scale-[1.01]"
                  placeholder="Enter donation quantity (ml)"
                  style={{
                    borderColor: "rgba(74,144,226,0.35)",
                    background:
                      "linear-gradient(135deg, #F5FBFF, #ECF9FF)",
                  }}
                  value={donationQty}
                  onChange={(e) => setDonationQty(e.target.value)}
                />

                <Button
                  className="w-full text-white py-3 text-lg shadow-md hover:shadow-xl transition-all hover:scale-[1.02]"
                  style={{
                    background:
                      "linear-gradient(135deg, #4A90E2 0%, #4AD2CC 100%)",
                  }}
                  onClick={handleDonationSubmit}
                >
                  Save Donation
                </Button>
              </div>

              {/* ✅ Receiving */}
              <div className="space-y-3">
                <Label
                  className="font-semibold flex items-center gap-2"
                  style={{ color: "#0E2A47" }}
                >
                  <Droplet className="h-5 w-5" style={{ color: "#4A90E2" }} />
                  {user.name} has RECEIVED blood
                </Label>

                <Input
                  type="number"
                  className="py-6 transition-all focus:scale-[1.01]"
                  placeholder="Enter received quantity (ml)"
                  style={{
                    borderColor: "rgba(74,144,226,0.35)",
                    background:
                      "linear-gradient(135deg, #F5FBFF, #ECF9FF)",
                  }}
                  value={receivedQty}
                  onChange={(e) => setReceivedQty(e.target.value)}
                />

                <Button
                  className="w-full text-white py-3 text-lg shadow-md hover:shadow-xl transition-all hover:scale-[1.02]"
                  style={{
                    background:
                      "linear-gradient(135deg, #FF6B6B 0%, #EF4D4D 100%)",
                  }}
                  onClick={handleReceiveSubmit}
                >
                  Save Blood Received
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}