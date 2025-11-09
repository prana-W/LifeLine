import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Phone, User, MapPin, Droplet, Locate } from "lucide-react";
import { toast } from "sonner";
import FancySearchBar from "../../components/general/SearchBar";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

export default function BloodDonation() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(null);
  const [quantity, setQuantity] = useState("");

  const [message, setMessage] = useState({ type: "", text: "" });

  // ---------------- FETCH USER ----------------
  const handleFetchUser = async () => {
    if (!phone.trim()) return;

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch(`${API_BASE_URL}/user/${phone}`);
      const data = await res.json();

      if (res.ok) {
        setUser(data.data);
        toast.success("User found!");
      } else {
        setUser(null);
        setMessage({ type: "error", text: data.message || "User not found!" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error, try again." });
    } finally {
      setLoading(false);
    }
  };

  // ---------------- SUBMIT DONATION ----------------
  const handleDonationSubmit = async () => {
    if (!quantity.trim()) {
      toast.error("Enter quantity!");
      return;
    }

    const body = {
      userId: user._id,
      quantity: Number(quantity),
    };

    try {
      const res = await fetch(`${API_BASE_URL}/user/donated`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Donation recorded!");
        setQuantity("");
      } else {
        toast.error(data.message || "Failed to save donation");
      }
    } catch (err) {
      toast.error("Network error!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-6"
         style={{ backgroundColor: "#dce8fb" }}>

      {/* BLUE GRID PATTERN BACKGROUND */}
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

      {/* MAIN CARD */}
      <Card className="max-w-2xl w-full shadow-2xl border-none relative z-10"
            style={{
              background:
                "linear-gradient(135deg, rgba(240,244,255,0.9), rgba(225,235,255,0.85))",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
            }}>
        
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center"
                     style={{ color: "#244b8b" }}>
            Blood Donation Entry
          </CardTitle>
          <CardDescription className="text-center"
                           style={{ color: "#3d5d96" }}>
            Search user and update blood donation details
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* ALERT */}
          {message.text && (
            <Alert
              className={`border-none ${
                message.type === "success" ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <AlertDescription
                className={`font-medium ${
                  message.type === "success" ? "text-green-700" : "text-red-700"
                }`}
              >
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          {/* PHONE INPUT */}
          <div className="space-y-2">
            <Label className="font-semibold"
                   style={{ color: "#244b8b" }}>
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
              background:
                "linear-gradient(135deg, #6a8dff, #4a6cff)",
            }}
            onClick={handleFetchUser}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search User"}
          </Button>

          {/* USER DETAILS CARD */}
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
                  <span><b>Phone:</b> {user.phoneNumber}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span><b>Pin Code:</b> {user.pinCode}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Locate className="h-5 w-5 text-blue-600" />
                  <span><b>Location:</b> {user.location || "Not Provided"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Droplet className="h-5 w-5 text-red-500" />
                  <span><b>Blood Type:</b> {user.bloodType}</span>
                </div>

              </CardContent>
            </Card>
          )}

          {/* DONATION FORM */}
          {user && (
            <div className="mt-6 space-y-4">

              <Label className="font-semibold flex items-center gap-2"
                     style={{ color: "#244b8b" }}>
                <Droplet className="h-5 w-5 text-red-500" />
                Quantity Donated (ml)
              </Label>

              <Input
                type="number"
                className="py-6"
                style={{
                  borderColor: "#bcd0ff",
                  background:
                    "linear-gradient(135deg, #e8f0ff, #dae8ff)",
                }}
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />

              <Button
                className="w-full text-white py-3 text-lg shadow-md"
                style={{
                  background:
                    "linear-gradient(135deg, #4fc476, #3da45e)",
                }}
                onClick={handleDonationSubmit}
              >
                Save Donation
              </Button>

            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
