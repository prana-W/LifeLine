import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Activity,
    PhoneCall,
    AlertCircle,
    Users,
    HeartPulse,
    Building2,
    Pill,
} from "lucide-react";
import EmergencyAlertBanner from "@/components/EmergencyAlert.jsx";
import MultiLangTypewriter from "@/components/general/Typewriter.jsx";

export default function HomePage() {
    const [role, setRole] = useState(null);
    const navigate = useNavigate();

    // Detect role from localStorage
    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        setRole(storedRole);
    }, []);

    // 🌐 Shared gradient background for all pages
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0F766E] via-[#0E7490] to-[#134E4A] text-white flex flex-col">
            {!role ? (
                <NoRoleHome navigate={navigate} />
            ) : (
                <RoleBasedHome role={role} navigate={navigate} />
            )}
        </div>
    );
}

/* --------------------- NO ROLE (Main Landing Page) --------------------- */
function NoRoleHome({ navigate }) {
    return (
        <section
            className="relative min-h-[calc(100vh-100px)] overflow-hidden flex items-center"
            style={{ backgroundColor: "#4AD2CC" }}
        >
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-30">
                <div
                    className="h-full w-full"
                    style={{
                        backgroundImage:
                            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
                        backgroundSize: "50px 50px",
                    }}
                ></div>
            </div>

            {/* Content Wrapper */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full grid md:grid-cols-2 gap-8 items-center ">

                {/* LEFT SECTION */}
                <div className="space-y-6 py-16 md:py-0">
                    {/* Icon */}
                    <div className="animate-pulse">
                        <Activity className="h-16 w-16 text-white" />
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight inline-block -translate-x-10">
                        <MultiLangTypewriter
                            texts={[
                                "Welcome to Lifeline",
                                "स्वागत है लाइफलाइन में",
                            ]}
                        />
                    </h1>

                    {/* Subheading */}
                    <p className="text-white text-lg md:text-xl opacity-90 max-w-md">
                        Lifeline brings hospitals, pharmacies, and emergency help together in one seamless platform.
                    </p>

                    {/* Buttons → Replaced with your role cards trigger */}
                    <div className="space-y-4 max-w-sm ">
                        <button
                            onClick={() => navigate("/hospital/auth")}
                            className="w-full py-4 bg-cyan-600 text-white font-medium rounded-full hover:scale-105 transition"
                        >
                            Hospital Portal
                        </button>

                        <button
                            onClick={() => navigate("/pharmacy/auth")}
                            className="w-full py-4  bg-cyan-600 text-white font-medium rounded-full hover:scale-105 transition"
                        >
                            Pharmacy Portal
                        </button>

                        <button
                            onClick={() => navigate("/user/auth")}
                            className="w-full py-4 bg-cyan-600 text-white font-medium rounded-full hover:scale-105 transition"
                        >
                            User Portal
                        </button>
                    </div>
                </div>

                {/* RIGHT SECTION → Doctor Image */}
                <div className="relative flex items-end justify-end h-full">
                    <img
                        src="/doctorwithlaptop.png"
                        alt="Doctor with Laptop"
                        className="w-full h-[500px] scale-[120%] object-contain drop-shadow-2xl translate-x-10"
                    />
                </div>
            </div>
        </section>
    );
}


/* --------------------- ROLE-BASED HOME --------------------- */
function RoleBasedHome({ role, navigate }) {
    switch (role) {
        case "hospital":
            return <HospitalHome navigate={navigate} />;
        case "pharmacy":
            return <PharmacyHome navigate={navigate} />;
        case "user":
            return <UserHome navigate={navigate} />;
        default:
            return <NoRoleHome navigate={navigate} />;
    }
}

/* --------------------- HOSPITAL HOME --------------------- */
function HospitalHome({ navigate }) {
    return (
        <>
            <section className="w-full py-24 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />

                <h1 className="text-4xl font-bold mb-3">Hospital Dashboard</h1>
                <p className="text-lg text-teal-100 mb-8">
                    Manage emergencies, patient admissions, and live alerts in real time.
                </p>

                <div className="flex gap-6">
                    <button
                        onClick={() => navigate("/hospital/emergencies")}
                        className="px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition text-white font-medium"
                    >
                        View Active Emergencies
                    </button>
                    <button
                        onClick={() => navigate("/hospital/bloodDonationHospitalPage")}
                        className="px-6 py-3 bg-teal-600 rounded-lg hover:bg-teal-700 transition text-white font-medium"
                    >
                        Manage Blood Requests
                    </button>
                </div>
            </section>

            <HospitalStats />
        </>
    );
}

function HospitalStats() {
    return (
        <section className="bg-white rounded-t-3xl p-10 text-black space-y-16">
            <h2 className="text-2xl font-bold mb-6 text-teal-700">
                Hospital Overview
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard icon={<Activity />} count="42" label="Active Emergencies" />
                <StatCard icon={<HeartPulse />} count="310" label="Patients Admitted" />
                <StatCard icon={<Users />} count="85" label="Doctors On Duty" />
            </div>
        </section>
    );
}

/* --------------------- PHARMACY HOME --------------------- */
function PharmacyHome({ navigate }) {
    return (
        <>
            <section className="w-full py-24 text-center relative overflow-hidden">
                <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />

                <h1 className="text-4xl font-bold mb-3">Pharmacy Portal</h1>
                <p className="text-lg text-teal-100 mb-8">
                    Manage medicine stock, prescriptions, and delivery requests.
                </p>

                <button
                    onClick={() => navigate("/pharmacy/stock")}
                    className="px-6 py-3 bg-emerald-600 rounded-lg hover:bg-emerald-700 transition text-white font-medium"
                >
                    Go to Dashboard
                </button>
            </section>

            <section className="bg-white rounded-t-3xl p-10 text-black">
                <h2 className="text-2xl font-bold mb-6 text-emerald-700">
                    Pharmacy Overview
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <StatCard icon={<Pill />} count="1,250" label="Medicines in Stock" />
                    <StatCard
                        icon={<Users />}
                        count="430"
                        label="Prescriptions Filled"
                    />
                    <StatCard icon={<Activity />} count="22" label="Pending Deliveries" />
                </div>
            </section>
        </>
    );
}

/* --------------------- USER HOME --------------------- */
import AmbulanceAlert from "@/components/AmbulanceAlert.jsx"

function UserHome({ navigate }) {
    // Function to open hospital map in a new tab
    const openMap = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    const mapsUrl = `https://www.google.com/maps/search/hospitals/@${latitude},${longitude},14z`;
                    window.open(mapsUrl, "_blank");
                },
                () => {
                    toast.error("Unable to fetch your location. Please enable location access.");
                }
            );
        } else {
            toast.error("Geolocation is not supported on your device.");
        }
    };

    return (
        <>
            {/* HERO SECTION */}
            <section className="w-full py-24 flex flex-col items-center justify-center text-center relative overflow-hidden bg-gradient-to-br from-teal-600 via-cyan-700 to-blue-800 text-white">
                {/* Subtle background glow effects */}
                <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />

                <h1 className="text-5xl font-extrabold mb-4 drop-shadow-md">
                    Emergency Assistance
                </h1>
                <p className="text-lg md:text-xl text-teal-100 mb-10 max-w-2xl">
                    Tap a button below to raise an alert or call for immediate help.
                </p>

                {/* ALERT BUTTONS SECTION */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-3xl px-6">
                    <div className="flex-1 w-full">
                        <EmergencyAlertBanner />
                    </div>
                    <div className="flex-1 w-full">
                        <AmbulanceAlert />
                    </div>
                </div>
            </section>

            {/* HEALTH DASHBOARD SECTION */}
            <section className="bg-white rounded-t-3xl p-10 md:p-16 text-black space-y-16 relative z-10 -mt-8 shadow-lg">
                <h2 className="text-3xl font-bold mb-8 text-teal-700 text-center md:text-left">
                    Your Health Dashboard
                </h2>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatCard icon={<HeartPulse />} count="8" label="Health Records" />
                    <StatCard icon={<Activity />} count="3" label="Active Alerts" />
                    <StatCard icon={<Building2 />} count="2" label="Nearby Hospitals" />
                </div>

                {/* Services Section */}
                <div className="mt-12">
                    <h3 className="text-3xl font-semibold mb-8 text-teal-700 text-center md:text-left">
                        Services You Can Access
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ServiceCard
                            title="Request Blood"
                            icon={<HeartPulse />}
                            onClick={() => navigate("/user/receiveBlood")}
                        />

                        {/* Scroll to top smoothly */}
                        <ServiceCard
                            title="Report Emergency"
                            icon={<AlertCircle />}
                            onClick={() => {
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                        />

                        {/* Open Google Maps in a new tab */}
                        <ServiceCard
                            title="View Emergency Map"
                            icon={<Activity />}
                            onClick={openMap}
                        />
                    </div>
                </div>
            </section>
        </>
    );
}



/* --------------------- REUSABLE COMPONENTS --------------------- */
function StatCard({ icon, count, label }) {
    return (
        <div className="bg-gray-50 p-6 rounded-xl shadow-md flex items-center gap-4">
            <div className="text-teal-600 w-10 h-10">{icon}</div>
            <div>
                <p className="text-3xl font-bold">{count}</p>
                <p className="text-gray-600">{label}</p>
            </div>
        </div>
    );
}

function ServiceCard({ title, icon, onClick }) {
    return (
        <div
            onClick={onClick}
            className="bg-teal-600 text-white p-6 rounded-xl shadow-lg hover:scale-[1.03] transition cursor-pointer"
        >
            {icon}
            <h3 className="text-xl font-semibold mb-2 mt-3">{title}</h3>
        </div>
    );
}
