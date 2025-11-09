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
    } catch {
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
      style={{ backgroundColor: "#dce8fb" }}
    >
      {/* ✅ GRID BACKGROUND */}
      <div className="absolute inset-0 opacity-50 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="grid-blue"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(120,160,255,0.35)"
                strokeWidth="1.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-blue)" />
        </svg>
      </div>

      {/* ✅ MAIN CARD */}
      <Card
        className="max-w-2xl w-full shadow-2xl border-none relative z-10 p-4"
        style={{
          background:
            "linear-gradient(135deg, rgba(240,244,255,0.9), rgba(225,235,255,0.85))",
          backdropFilter: "blur(10px)",
          borderRadius: "20px",
        }}
      >
        <CardHeader>
          <CardTitle
            className="text-3xl font-bold text-center"
            style={{ color: "#244b8b" }}
          >
            Blood Management
          </CardTitle>
          <CardDescription
            className="text-center"
            style={{ color: "#3d5d96" }}
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
            <Label className="font-semibold" style={{ color: "#244b8b" }}>
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

          <Button
            className="w-full text-white py-3 text-lg shadow-md"
            style={{
              background: "linear-gradient(135deg, #6a8dff, #4a6cff)",
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
                background:
                  "linear-gradient(135deg, rgba(240,245,255,0.9), rgba(225,235,255,0.85))",
                borderColor: "#bcd0ff",
              }}
            >
              <CardHeader>
                <CardTitle
                  className="text-xl font-bold flex items-center gap-2"
                  style={{ color: "#244b8b" }}
                >
                  <User className="text-blue-500" /> {user.name}
                </CardTitle>
                <CardDescription className="text-blue-700">
                  User Details
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 text-blue-900">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <span>
                    <b>Phone:</b> {user.phoneNumber}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span>
                    <b>Pin Code:</b> {user.pinCode}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Locate className="h-5 w-5 text-blue-600" />
                  <span>
                    <b>Location:</b> {user.location || "Not Provided"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Droplet className="h-5 w-5 text-red-500" />
                  <span>
                    <b>Blood Type:</b> {user.bloodType}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ✅ DONATION + RECEIVING SECTIONS */}
          {user && (
            <div className="mt-6 space-y-10">

              {/* ✅ Donation */}
              <div className="space-y-3">
                <Label
                  className="font-semibold flex items-center gap-2"
                  style={{ color: "#244b8b" }}
                >
                  <Droplet className="h-5 w-5 text-red-500" />
                  {user.name} has DONATED blood
                </Label>

                <Input
                  type="number"
                  className="py-6"
                  placeholder="Enter donation quantity (ml)"
                  style={{
                    borderColor: "#bcd0ff",
                    background:
                      "linear-gradient(135deg, #e8f0ff, #dae8ff)",
                  }}
                  value={donationQty}
                  onChange={(e) => setDonationQty(e.target.value)}
                />

                <Button
                  className="w-full text-white py-3 text-lg shadow-md"
                  style={{
                    background: "linear-gradient(135deg, #4fc476, #3da45e)",
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
                  style={{ color: "#244b8b" }}
                >
                  <Droplet className="h-5 w-5 text-blue-600" />
                  {user.name} has RECEIVED blood
                </Label>

                <Input
                  type="number"
                  className="py-6"
                  placeholder="Enter received quantity (ml)"
                  style={{
                    borderColor: "#bcd0ff",
                    background:
                      "linear-gradient(135deg, #ffecec, #ffdada)",
                  }}
                  value={receivedQty}
                  onChange={(e) => setReceivedQty(e.target.value)}
                />

                <Button
                  className="w-full text-white py-3 text-lg shadow-md"
                  style={{
                    background: "linear-gradient(135deg, #ff6b6b, #e45252)",
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
