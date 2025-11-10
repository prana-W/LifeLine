import { Activity, PhoneCall, AlertCircle, Users, HeartPulse, Building2 } from "lucide-react";
import EmergencyAlertBanner from "@/components/EmergencyAlert.jsx";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F766E] via-[#0E7490] to-[#134E4A] text-white">

        <section className="w-full py-24 flex flex-col items-center justify-center text-center relative overflow-hidden">

        {/* Floating blobs */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />

        <h1 className="text-4xl font-bold mb-3">Emergency Assistance</h1>
        <p className="text-lg text-teal-100 mb-8">Tap the button below to raise an immediate alert.</p>

       <EmergencyAlertBanner />
      </section>
      
     

      {/* MAIN CONTENT SECTIONS */}
      <section className="bg-white rounded-t-3xl p-10 text-black space-y-16">

        {/* QUICK STATS */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-teal-700">Platform Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            <div className="bg-gray-50 p-6 rounded-xl shadow-md flex items-center gap-4">
              <Users className="text-teal-600 w-10 h-10" />
              <div>
                <p className="text-3xl font-bold">12,430</p>
                <p className="text-gray-600">Registered Users</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow-md flex items-center gap-4">
              <HeartPulse className="text-teal-600 w-10 h-10" />
              <div>
                <p className="text-3xl font-bold">3,120</p>
                <p className="text-gray-600">Patients Assisted</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow-md flex items-center gap-4">
              <Building2 className="text-teal-600 w-10 h-10" />
              <div>
                <p className="text-3xl font-bold">54</p>
                <p className="text-gray-600">Hospitals Connected</p>
              </div>
            </div>

          </div>
        </div>

        {/* FEATURES SECTION */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-teal-700">Services We Provide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-teal-600 text-white p-6 rounded-xl shadow-lg hover:scale-[1.03] transition">
              <PhoneCall className="w-10 h-10 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Call Nearby Hospital</h3>
              <p className="text-white/80 text-sm">Automatically notify the nearest hospital during an emergency.</p>
            </div>

            <div className="bg-teal-600 text-white p-6 rounded-xl shadow-lg hover:scale-[1.03] transition">
              <HeartPulse className="w-10 h-10 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Request Blood</h3>
              <p className="text-white/80 text-sm">Raise an urgent or scheduled blood requirement alert.</p>
            </div>

            <div className="bg-teal-600 text-white p-6 rounded-xl shadow-lg hover:scale-[1.03] transition">
              <Activity className="w-10 h-10 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Track Active Emergencies</h3>
              <p className="text-white/80 text-sm">View and respond to real-time emergency alerts happening near you.</p>
            </div>

          </div>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="text-center py-6 text-teal-200 text-sm bg-[#0B3B37]">
        © 2025 Lifeline
      </footer>
    </div>
  );
}
