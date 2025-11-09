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
import { Phone, User, MapPin, Droplet, Locate } from "lucide-react";
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
      className="min-h-screen flex items-center justify-center relative p-6"
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

      {/* ✅ MAIN CARD */}
      <Card
        className="max-w-2xl w-full shadow-xl border-none relative z-10 p-4"
        style={{
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(12px)",
          borderRadius: "20px",
        }}
      >
        <CardHeader>
          <CardTitle
            className="text-3xl font-bold text-center"
            style={{ color: "#0E2A47" }}
          >
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
            className="w-full text-white py-3 text-lg shadow-md"
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
              className="mt-6 shadow-lg border"
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
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5" style={{ color: "#4A90E2" }} />
                  <span>
                    <b>Phone:</b> {user.phoneNumber}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" style={{ color: "#4A90E2" }} />
                  <span>
                    <b>Pin Code:</b> {user.pinCode}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Locate className="h-5 w-5" style={{ color: "#4A90E2" }} />
                  <span>
                    <b>Location:</b> {user.location || "Not Provided"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
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
                  className="py-6"
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
                  className="w-full text-white py-3 text-lg shadow-md"
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
                  className="py-6"
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
                  className="w-full text-white py-3 text-lg shadow-md"
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
