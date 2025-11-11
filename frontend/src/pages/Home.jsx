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
    Shield,
    Clock,
    Award,
    TrendingUp,
    Zap,
    CheckCircle,
    Star,
    Quote,
    MapPin,
    Phone,
    Mail,
    ArrowRight,
    Smartphone,
    Globe,
    Sparkles
} from "lucide-react";
import EmergencyAlertBanner from "@/components/EmergencyAlert.jsx";
import MultiLangTypewriter from "@/components/general/Typewriter.jsx";
import Timeline from "@/components/general/Timeline.jsx";
import MagneticPortalButtons from "@/components/general/MagneticButton.jsx";


function ManagementCard({ icon, title, description, color }) {
    return (
        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-gray-100">
            <div className={`${color} w-16 h-16 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md`}>
                {icon}
            </div>
            <h4 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-teal-600 transition-colors">
                {title}
            </h4>
            <p className="text-gray-600 leading-relaxed">
                {description}
            </p>
        </div>
    );
}

/* --------------------- MINI STAT CARD COMPONENT --------------------- */
function MiniStatCard({ number, label }) {
    return (
        <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all group">
            <div className="text-2xl font-bold text-teal-600 mb-1 group-hover:scale-110 transition-transform">
                {number}
            </div>
            <div className="text-gray-600 text-sm">
                {label}
            </div>
        </div>
    );
}

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
    const [activeFeature, setActiveFeature] = useState(0);

    // Facility timeline data
    const facilityData = [
        {
            image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e",
            title: "Emergency Alert System",
            desc: "Raise an emergency alert in one tap."
        },
        {
            image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
            title: "Blood Donation Portal",
            desc: "Request or donate blood instantly."
        },
        {
            image: "./Timeline/emergency.jpg",
            title: "One Click Ambulance",
            desc: "Call an ambulance with a single click."
        },
        {
            image: "./Timeline/inventory.jpg",
            title: "Pharmacy Inventory",
            desc: "Manage and track medicine stock."
        },
        {
            image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
            title: "Unified Healthcare Network",
            desc: "Connecting users, hospitals and pharmacies."
        }
    ];

    const features = [
        { icon: <Zap className="h-6 w-6" />, text: "Instant Emergency Response" },
        { icon: <Shield className="h-6 w-6" />, text: "Secure & Private" },
        { icon: <Clock className="h-6 w-6" />, text: "24/7 Availability" },
        { icon: <Award className="h-6 w-6" />, text: "Verified Healthcare Network" }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % features.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <section
                className="relative min-h-[calc(100vh-100px)] overflow-hidden flex items-center "
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

                {/* Floating Elements */}
                <div className="absolute top-20 left-10 animate-bounce">
                    <HeartPulse className="h-12 w-12 text-white/30" />
                </div>
                <div className="absolute bottom-32 right-20 animate-pulse">
                    <Activity className="h-16 w-16 text-white/20" />
                </div>

                {/* Content Wrapper */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full grid md:grid-cols-2 gap-8 items-center">

                    {/* LEFT SECTION */}
                    <div className="space-y-6 py-16 md:py-0">
                        <div className="animate-pulse">
                            <Activity className="h-16 w-16 text-white" />
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight inline-block -translate-x-5">
                            <MultiLangTypewriter
                                texts={[
                                    "Welcome to Lifeline",
                                    "स्वागत है लाइफलाइन में",
                                ]}
                            />
                        </h1>

                        <p className="text-white text-lg md:text-xl opacity-90 max-w-md">
                            Lifeline brings hospitals, pharmacies, and emergency help together in one seamless platform.
                        </p>

                        {/* Rotating Features */}
                        {/* <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md">
                            <div className="flex items-center gap-3 text-white transition-all duration-500">
                                <div className="transform transition-transform duration-500 scale-110">
                                    {features[activeFeature].icon}
                                </div>
                                <span className="font-medium text-lg">
                                    {features[activeFeature].text}
                                </span>
                            </div>
                            <div className="flex gap-2 mt-4">
                                {features.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${i === activeFeature ? "bg-white" : "bg-white/30"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div> */}

                        <MagneticPortalButtons navigate={navigate} />
                    </div>

                    {/* RIGHT SECTION */}
                    <div className="relative flex items-end justify-end h-full">
                        <img
                            src="/doctorwithlaptop.png"
                            alt="Doctor with Laptop"
                            className="w-full h-[500px] scale-[120%] object-contain drop-shadow-2xl translate-x-10"
                        />
                    </div>
                </div>
            </section>

            {/* STATS SECTION */}
            <section className="w-full bg-gradient-to-b from-teal-800 to-teal-700 py-20 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-10 left-20 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-20 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-white mb-4">Trusted by Thousands</h2>
                        <p className="text-teal-100 text-lg max-w-2xl mx-auto">
                            Our platform connects healthcare providers and patients across the nation,
                            delivering life-saving services every single day.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <StatBox icon={<Users />} number="10,000+" label="Active Users" />
                        <StatBox icon={<Building2 />} number="250+" label="Partner Hospitals" />
                        <StatBox icon={<Pill />} number="500+" label="Pharmacies" />
                        <StatBox icon={<TrendingUp />} number="99.9%" label="Uptime" />
                    </div>
                </div>
            </section>

            {/* FACILITIES TIMELINE SECTION */}
            <section className="w-full bg-white py-20 rounded-t-3xl shadow-inner relative">
                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-teal-100 to-transparent rounded-br-full opacity-50"></div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-cyan-100 to-transparent rounded-bl-full opacity-50"></div>

                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 bg-teal-100 px-6 py-2 rounded-full mb-4">
                        <Sparkles className="h-5 w-5 text-teal-600" />
                        <span className="text-teal-700 font-semibold">Our Services</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-teal-700 mb-4">
                        Facilities We Offer
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto px-6">
                        Comprehensive healthcare solutions designed to save lives and improve health outcomes
                        through innovative technology and seamless coordination.
                    </p>
                </div>

                <Timeline items={facilityData} gap={80} />
            </section>

            {/* WHY CHOOSE US SECTION */}
            <section className="w-full bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 py-20 relative overflow-hidden">
                {/* Animated background blobs */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-white px-6 py-2 rounded-full mb-4 shadow-md">
                            <Award className="h-5 w-5 text-teal-600" />
                            <span className="text-teal-700 font-semibold">Why We're Different</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-teal-700 mb-4">
                            Why Choose Lifeline?
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            We combine cutting-edge technology with compassionate care to deliver
                            the best healthcare experience possible.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        <FeatureCard
                            icon={<Zap className="h-10 w-10" />}
                            title="Lightning Fast"
                            description="Get emergency help in seconds with our one-tap alert system. Every second counts in an emergency, and our platform ensures instant connectivity with nearby healthcare providers."
                            color="bg-gradient-to-br from-yellow-400 to-orange-500"
                        />
                        <FeatureCard
                            icon={<Shield className="h-10 w-10" />}
                            title="Highly Secure"
                            description="Your medical data is encrypted and protected with enterprise-grade security. We comply with all healthcare privacy regulations to keep your information safe and confidential."
                            color="bg-gradient-to-br from-blue-400 to-indigo-500"
                        />
                        <FeatureCard
                            icon={<CheckCircle className="h-10 w-10" />}
                            title="Verified Network"
                            description="All hospitals and pharmacies are verified and certified healthcare providers. We ensure quality care by partnering only with licensed and accredited facilities."
                            color="bg-gradient-to-br from-green-400 to-emerald-500"
                        />
                    </div>

                    {/* Additional Benefits */}
                    <div className="bg-white rounded-3xl shadow-xl p-10 md:p-12">
                        <h3 className="text-3xl font-bold text-teal-700 mb-8 text-center">
                            More Reasons to Trust Us
                        </h3>
                        <div className="grid md:grid-cols-2 gap-8">
                            <BenefitItem
                                icon={<Clock className="h-6 w-6 text-teal-600" />}
                                title="24/7 Availability"
                                description="Round-the-clock access to emergency services and healthcare support"
                            />
                            <BenefitItem
                                icon={<Smartphone className="h-6 w-6 text-teal-600" />}
                                title="Mobile-First Design"
                                description="Easy-to-use interface optimized for quick access on any device"
                            />
                            <BenefitItem
                                icon={<Globe className="h-6 w-6 text-teal-600" />}
                                title="Wide Coverage"
                                description="Connected to healthcare facilities across multiple cities and regions"
                            />
                            <BenefitItem
                                icon={<HeartPulse className="h-6 w-6 text-teal-600" />}
                                title="Life-Saving Network"
                                description="Coordinated care between hospitals, pharmacies, and emergency responders"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="w-full bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 py-24 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="max-w-5xl mx-auto text-center px-6 relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-6">
                        <Star className="h-5 w-5 text-white fill-white" />
                        <span className="text-white font-semibold">Join Our Community</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl md:text-2xl text-white/95 mb-4">
                        Join thousands of users who trust Lifeline for their healthcare needs
                    </p>
                    <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
                        Whether you need emergency assistance, blood donation services, or pharmacy supplies,
                        Lifeline connects you instantly. Sign up in seconds and experience healthcare reimagined.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                        <button
                            onClick={() => navigate("/user/auth")}
                            className="group px-10 py-5 bg-white text-teal-600 font-bold text-lg rounded-full hover:scale-105 transition-all shadow-2xl hover:shadow-3xl flex items-center gap-3"
                        >
                            Get Started Now
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className="px-10 py-5 bg-transparent border-2 border-white text-white font-bold text-lg rounded-full hover:bg-white hover:text-teal-600 transition-all"
                        >
                            Learn More
                        </button>
                    </div>

                    {/* Trust badges */}
                    <div className="flex flex-wrap justify-center gap-8 mt-12 text-white/80">
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            <span className="text-sm">100% Secure</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            <span className="text-sm">24/7 Support</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 fill-white/80" />
                            <span className="text-sm">4.9/5 Rating</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            <span className="text-sm">Verified Network</span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

/* --------------------- BENEFIT ITEM COMPONENT --------------------- */
function BenefitItem({ icon, title, description }) {
    return (
        <div className="flex gap-4 items-start group">
            <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div>
                <h4 className="text-lg font-bold text-gray-800 mb-1">{title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

/* --------------------- STAT BOX COMPONENT --------------------- */
function StatBox({ icon, number, label }) {
    return (
        <div className="text-center group cursor-default">
            <div className="flex justify-center mb-4 text-white/80 group-hover:text-white transition-all group-hover:scale-110 transform duration-300">
                <div className="w-16 h-16 flex items-center justify-center">
                    {icon}
                </div>
            </div>
            <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-105 transition-transform">
                {number}
            </div>
            <div className="text-white/90 text-sm md:text-base font-medium">
                {label}
            </div>
        </div>
    );
}

/* --------------------- FEATURE CARD COMPONENT --------------------- */
function FeatureCard({ icon, title, description, color }) {
    return (
        <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 group border border-gray-100">
            <div className={`${color} w-20 h-20 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-teal-600 transition-colors">
                {title}
            </h3>
            <p className="text-gray-600 leading-relaxed text-base">
                {description}
            </p>
        </div>
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
                <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10">
                    <Activity className="absolute top-10 right-10 h-20 w-20 animate-pulse" />
                    <HeartPulse className="absolute bottom-20 left-20 h-24 w-24 animate-pulse delay-500" />
                </div>


                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-6">
                    <Building2 className="h-5 w-5 text-white" />
                    <span className="text-white font-semibold">Hospital Portal</span>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold mb-4">Hospital Dashboard</h1>
                <p className="text-xl text-teal-100 mb-4 max-w-3xl">
                    Manage emergencies, patient admissions, and live alerts in real time.
                </p>
                <p className="text-lg text-teal-200 mb-10 max-w-2xl">
                    Streamline your hospital operations with our comprehensive management system.
                    Monitor critical cases, coordinate with emergency services, and ensure optimal patient care.
                </p>

                <div className="flex flex-col sm:flex-row gap-6">
                    <button
                        onClick={() => navigate("/hospital/emergencies")}
                        className="group px-8 py-4 bg-red-600 rounded-xl hover:bg-red-700 transition-all text-white font-semibold shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-3 justify-center"
                    >
                        <AlertCircle className="h-5 w-5" />
                        View Active Emergencies
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={() => navigate("/hospital/bloodDonationHospitalPage")}
                        className="group px-8 py-4 bg-teal-600 rounded-xl hover:bg-teal-700 transition-all text-white font-semibold shadow-xl hover:shadow-2xl hover:scale-105 flex items-center gap-3 justify-center"
                    >
                        <HeartPulse className="h-5 w-5" />
                        Manage Blood Requests
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </section>

            <HospitalStats />
            <HospitalFeatures navigate={navigate} />
        </>
    );
}

function HospitalStats({ navigate }) {
    return (
        <section className="bg-white rounded-t-3xl p-10 md:p-16 text-black space-y-12 relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-100 rounded-full blur-3xl opacity-30 -z-0"></div>

            <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-teal-100 px-6 py-2 rounded-full mb-4">
                    <Activity className="h-5 w-5 text-teal-600" />
                    <span className="text-teal-700 font-semibold">Real-Time Analytics</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3 text-teal-700">
                    Hospital Overview
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl">
                    Track and monitor all critical metrics in real-time. Stay informed about your hospital's
                    operations and respond quickly to any situation.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
                <StatCard icon={<Activity />} count="42" label="Active Emergencies" />
                <StatCard icon={<HeartPulse />} count="310" label="Patients Admitted" />
                <StatCard icon={<Users />} count="85" label="Doctors On Duty" />
            </div>

            {/* Additional metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-gray-200 relative z-10">
                <MiniStatCard number="156" label="Blood Units Available" />
                <MiniStatCard number="23" label="Operating Rooms" />
                <MiniStatCard number="94%" label="Bed Occupancy" />
                <MiniStatCard number="18" label="Ambulances Active" />
            </div>
        </section>
    );
}

function HospitalFeatures({ navigate }) {
    return (
        <section className="bg-gradient-to-br from-gray-50 to-teal-50 py-16 px-6 md:px-16">
            <div className="max-w-7xl mx-auto">
                <h3 className="text-3xl font-bold text-teal-700 mb-12 text-center">
                    Comprehensive Hospital Management
                </h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <ManagementCard
                        icon={<AlertCircle className="h-8 w-8" />}
                        title="Emergency Management"
                        description="Coordinate rapid response teams, track ambulances, and manage critical cases with real-time updates."
                        color="bg-red-500"
                    />
                    <ManagementCard
                        icon={<Users className="h-8 w-8" />}
                        title="Patient Records"
                        description="Access comprehensive patient histories, treatment plans, and medical records securely."
                        color="bg-blue-500"
                    />
                    <ManagementCard
                        icon={<HeartPulse className="h-8 w-8" />}
                        title="Blood Bank System"
                        description="Monitor blood inventory, process donation requests, and manage critical blood supply efficiently."
                        color="bg-pink-500"
                    />
                    <ManagementCard
                        icon={<Activity className="h-8 w-8" />}
                        title="ICU Monitoring"
                        description="Track vital signs, bed availability, and critical care equipment in real-time."
                        color="bg-purple-500"
                    />
                    <ManagementCard
                        icon={<Building2 className="h-8 w-8" />}
                        title="Department Coordination"
                        description="Seamlessly coordinate between departments for optimal patient care and resource allocation."
                        color="bg-teal-500"
                    />
                    <ManagementCard
                        icon={<Phone className="h-8 w-8" />}
                        title="Communication Hub"
                        description="Instant messaging between staff, departments, and emergency services for quick response."
                        color="bg-cyan-500"
                    />
                </div>
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
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10">
                    <Pill className="absolute top-10 left-10 h-20 w-20 animate-bounce" />
                    <Activity className="absolute bottom-20 right-20 h-24 w-24 animate-pulse" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-6">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-6">
                        <Pill className="h-5 w-5 text-white" />
                        <span className="text-white font-semibold">Pharmacy Management</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold mb-4">Pharmacy Portal</h1>
                    <p className="text-xl text-teal-100 mb-4 max-w-3xl mx-auto">
                        Manage medicine stock, prescriptions, and delivery requests.
                    </p>
                    <p className="text-lg text-teal-200 mb-10 max-w-2xl mx-auto">
                        Streamline your pharmacy operations with intelligent inventory management,
                        automated alerts for low stock, and seamless prescription processing.
                    </p>

                    <button
                        onClick={() => navigate("/pharmacy/stock")}
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-all text-white font-semibold shadow-xl hover:shadow-2xl hover:scale-105"
                    >
                        <Activity className="h-5 w-5" />
                        Go to Dashboard
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </section>

            <section className="bg-white rounded-t-3xl p-10 md:p-16 text-black space-y-12 relative">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-30 -z-0"></div>

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-emerald-100 px-6 py-2 rounded-full mb-4">
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">Performance Metrics</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-3 text-emerald-700">
                        Pharmacy Overview
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl">
                        Monitor your pharmacy's performance with comprehensive analytics and real-time
                        inventory tracking. Optimize your stock levels and improve customer service.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
                    <StatCard icon={<Pill />} count="1,250" label="Medicines in Stock" />
                    <StatCard icon={<Users />} count="430" label="Prescriptions Filled" />
                    <StatCard icon={<Activity />} count="22" label="Pending Deliveries" />
                </div>

                {/* Additional metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-gray-200 relative z-10">
                    <MiniStatCard number="45" label="Low Stock Alerts" />
                    <MiniStatCard number="892" label="Monthly Orders" />
                    <MiniStatCard number="98%" label="Order Accuracy" />
                    <MiniStatCard number="4.8" label="Customer Rating" />
                </div>
            </section>

            <PharmacyFeatures navigate={navigate} />
        </>
    );
}

function PharmacyFeatures({ navigate }) {
    return (
        <section className="bg-gradient-to-br from-gray-50 to-emerald-50 py-16 px-6 md:px-16">
            <div className="max-w-7xl mx-auto">
                <h3 className="text-3xl font-bold text-emerald-700 mb-12 text-center">
                    Complete Pharmacy Solutions
                </h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <ManagementCard
                        icon={<Pill className="h-8 w-8" />}
                        title="Inventory Management"
                        description="Track medicine stock levels, expiry dates, and automatically generate reorder alerts for seamless operations."
                        color="bg-emerald-500"
                    />
                    <ManagementCard
                        icon={<Activity className="h-8 w-8" />}
                        title="Prescription Processing"
                        description="Digitally process prescriptions, verify dosages, and maintain comprehensive medication records."
                        color="bg-blue-500"
                    />
                    <ManagementCard
                        icon={<Users className="h-8 w-8" />}
                        title="Customer Management"
                        description="Maintain customer profiles, medication history, and provide personalized health recommendations."
                        color="bg-purple-500"
                    />
                    <ManagementCard
                        icon={<TrendingUp className="h-8 w-8" />}
                        title="Sales Analytics"
                        description="Track sales trends, identify popular medications, and optimize your inventory based on demand."
                        color="bg-indigo-500"
                    />
                    <ManagementCard
                        icon={<Phone className="h-8 w-8" />}
                        title="Delivery Tracking"
                        description="Manage home delivery orders, track delivery status, and ensure timely medication delivery."
                        color="bg-cyan-500"
                    />
                    <ManagementCard
                        icon={<AlertCircle className="h-8 w-8" />}
                        title="Emergency Supplies"
                        description="Coordinate with hospitals for emergency medication needs and maintain critical drug reserves."
                        color="bg-red-500"
                    />
                </div>
            </div>
        </section>
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
                <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/10 blur-3xl animate-pulse" />
                <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full bg-white/5 blur-3xl animate-pulse delay-500" />

                <div className="relative z-10 px-6 max-w-5xl">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
                        <AlertCircle className="h-5 w-5 text-white" />
                        <span className="text-white font-semibold">Emergency Services</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-md">
                        Emergency Assistance
                    </h1>
                    <p className="text-xl md:text-2xl text-teal-100 mb-4 max-w-3xl mx-auto">
                        Tap a button below to raise an alert or call for immediate help.
                    </p>
                    <p className="text-lg text-teal-200 mb-10 max-w-2xl mx-auto">
                        Get instant access to emergency services, nearby hospitals, and critical healthcare support.
                        Your safety is our priority, 24/7.
                    </p>

                    {/* ALERT BUTTONS SECTION */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-3xl mx-auto">
                        <div className="flex-1 w-full">
                            <EmergencyAlertBanner />
                        </div>
                        <div className="flex-1 w-full">
                            <AmbulanceAlert />
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto">
                        <div className="text-center">
                            <div className="text-3xl font-bold mb-1">{'<'}2min</div>
                            <div className="text-sm text-teal-200">Avg Response Time</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold mb-1">24/7</div>
                            <div className="text-sm text-teal-200">Always Available</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold mb-1">100%</div>
                            <div className="text-sm text-teal-200">Secure & Private</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HEALTH DASHBOARD SECTION */}
            <section className="bg-white rounded-t-3xl p-10 md:p-16 text-black space-y-16 relative z-10 -mt-8 shadow-lg">
                <div>
                    <div className="inline-flex items-center gap-2 bg-teal-100 px-6 py-2 rounded-full mb-4">
                        <HeartPulse className="h-5 w-5 text-teal-600" />
                        <span className="text-teal-700 font-semibold">Your Healthcare Hub</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-4 text-teal-700 text-center md:text-left">
                        Your Health Dashboard
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl text-center md:text-left">
                        Access all your health information, track active alerts, and manage your healthcare
                        needs from one convenient location.
                    </p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatCard icon={<HeartPulse />} count="8" label="Health Records" />
                    <StatCard icon={<Activity />} count="3" label="Active Alerts" />
                    <StatCard icon={<Building2 />} count="2" label="Nearby Hospitals" />
                </div>

                {/* Services Section */}
                <div className="mt-12">
                    <h3 className="text-3xl font-semibold mb-4 text-teal-700 text-center md:text-left">
                        Services You Can Access
                    </h3>
                    <p className="text-gray-600 mb-8 text-center md:text-left max-w-2xl">
                        From blood donation to emergency reporting, we provide comprehensive healthcare
                        services at your fingertips.
                    </p>

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

            <UserFeatures navigate={navigate} />
        </>
    );
}

function UserFeatures({ navigate }) {
    return (
        <section className="bg-gradient-to-br from-gray-50 to-cyan-50 py-16 px-6 md:px-16">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-teal-100 px-6 py-2 rounded-full mb-4">
                        <Star className="h-5 w-5 text-teal-600" />
                        <span className="text-teal-700 font-semibold">Complete Care</span>
                    </div>
                    <h3 className="text-4xl font-bold text-teal-700 mb-4">
                        Everything You Need for Better Health
                    </h3>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Comprehensive healthcare services designed to keep you and your loved ones safe and healthy.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <ManagementCard
                        icon={<AlertCircle className="h-8 w-8" />}
                        title="One-Tap Emergency"
                        description="Instantly alert nearby hospitals and emergency services with your exact location and medical information."
                        color="bg-red-500"
                    />
                    <ManagementCard
                        icon={<HeartPulse className="h-8 w-8" />}
                        title="Blood Donation Network"
                        description="Request or donate blood seamlessly. Connect with donors and recipients in your area instantly."
                        color="bg-pink-500"
                    />
                    <ManagementCard
                        icon={<Phone className="h-8 w-8" />}
                        title="Ambulance Services"
                        description="Direct line to ambulance services with real-time tracking and estimated arrival times."
                        color="bg-blue-500"
                    />
                    <ManagementCard
                        icon={<Building2 className="h-8 w-8" />}
                        title="Hospital Finder"
                        description="Locate nearby hospitals, check bed availability, and view specializations and ratings."
                        color="bg-teal-500"
                    />
                    <ManagementCard
                        icon={<Pill className="h-8 w-8" />}
                        title="Medicine Delivery"
                        description="Order medicines from verified pharmacies with doorstep delivery and prescription management."
                        color="bg-emerald-500"
                    />
                    <ManagementCard
                        icon={<Activity className="h-8 w-8" />}
                        title="Health Tracking"
                        description="Monitor your health records, prescriptions, and medical history in one secure location."
                        color="bg-purple-500"
                    />
                </div>
            </div>
        </section>
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