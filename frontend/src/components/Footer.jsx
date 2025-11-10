import React, { useState, useEffect } from "react";
import { Heart, Github, Linkedin, Mail, Phone, MapPin, Eye, Activity, Pill, User } from "lucide-react";
import useApi from "@/hooks/useApi";

// ============================
// THEME & CONTENT MAP (PER ROLE)
// ============================
const roleConfig = {
  pharmacy: {
    theme: {
      waveGradient: ["#D8C4FF", "#BFA6FF", "#A78FFF"],
      footerGradient: "linear-gradient(135deg, #D8C4FF, #BFA6FF, #A78FFF, #957AFF)",
      iconColor: "#7A67C7",
      accent: "#B8A8FF"
    },
    icon: Pill,
    quickLinks: [
      { label: "Home", href: "/pharmacy" },
      { label: "Manage Stock", href: "/pharmacy/stock" },
      { label: "Orders", href: "/pharmacy/orders" },
      { label: "Analytics", href: "/pharmacy/analytics" },
      { label: "Support", href: "/pharmacy/support" }
    ],
    tagline: "Managing medicines, ensuring health for all."
  },

  hospital: {
    theme: {
      waveGradient: ["#0F766E", "#0E7490", "#134E4A"],
      footerGradient: "linear-gradient(135deg, #1BA79A, #118A7E, #0F766E)",
      iconColor: "#4AD2CC",
      accent: "#3BB5AF"
    },
    icon: Activity,
    quickLinks: [
      { label: "Dashboard", href: "/hospital" },
      { label: "Emergencies", href: "/hospital/emergencies" },
      { label: "Blood Bank", href: "/hospital/blood" },
      { label: "Patients", href: "/hospital/patients" },
      { label: "Staff", href: "/hospital/staff" }
    ],
    tagline: "Saving lives, one emergency at a time."
  },

  user: {
    theme: {
      waveGradient: ["#0891b2", "#06b6d4", "#14b8a6"],
      footerGradient: "linear-gradient(135deg, #0891b2, #06b6d4, #14b8a6)",
      iconColor: "#06b6d4",
      accent: "#67e8f9"
    },
    icon: User,
    quickLinks: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Find Hospital", href: "/hospitals" },
      { label: "Blood Donation", href: "/donate" },
      { label: "Emergency", href: "/emergency" }
    ],
    tagline: "Your health, our priority. Connect with care instantly."
  }
};

export default function MediBridgeFooter() {
  const [visitorCount, setVisitorCount] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const api = useApi();

  // Detect role from localStorage
  const role = localStorage.getItem("role") || "user";
  const config = roleConfig[role] || roleConfig.user;
  const { theme, icon: RoleIcon, quickLinks, tagline } = config;

  // Fetch & increment visitors
  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        await api.post("/visitors");
        const res = await api.get("/visitors");
        setVisitorCount(res.data?.count || 0);
      } catch (err) {
        console.error("Failed to fetch visitors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitors();
  }, [api]);

  // Animate counter
  useEffect(() => {
    if (visitorCount === 0) return;

    let start = 0;
    const duration = 1500;
    const increment = visitorCount / (duration / 16);

    const interval = setInterval(() => {
      start += increment;
      if (start >= visitorCount) {
        start = visitorCount;
        clearInterval(interval);
      }
      setDisplayCount(Math.floor(start));
    }, 16);

    return () => clearInterval(interval);
  }, [visitorCount]);

  return (
    <footer className="relative mt-auto">
      {/* WAVE SECTION */}
      <div className="relative" style={{ backgroundColor: "#F2F2F2" }}>
        <svg
          className="w-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{ height: "100px", transform: "rotate(180deg)" }}
        >
          <defs>
            <linearGradient id={`footerWave-${role}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={theme.waveGradient[0]} />
              <stop offset="50%" stopColor={theme.waveGradient[1]} />
              <stop offset="100%" stopColor={theme.waveGradient[2]} />
            </linearGradient>
          </defs>

          <path
            fill={`url(#footerWave-${role})`}
            d="M0,0 C150,60 350,0 600,40 C850,80 1050,20 1200,50 L1200,120 L0,120 Z"
          />
        </svg>
      </div>

      {/* FOOTER CONTENT */}
      <div
        className="text-white"
        style={{ background: theme.footerGradient }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            
            {/* BRAND */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <RoleIcon className="h-8 w-8" style={{ color: theme.iconColor }} />
                <span className="text-2xl font-bold">LifeLine</span>
              </div>

              <p className="text-sm opacity-90 mb-4">
                {tagline}
              </p>

              {/* VISITOR COUNTER */}
              <div
                className="flex items-center space-x-3 rounded-lg px-4 py-3 transition-all hover:scale-105"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  border: "1px solid rgba(255, 255, 255, 0.2)"
                }}
              >
                <Eye className="h-6 w-6 animate-pulse" />
                <div>
                  <p className="text-xs opacity-80">Total Visitors</p>
                  <p className="text-xl font-bold tabular-nums">
                    {loading ? "..." : displayCount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* QUICK LINKS */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm opacity-90">
                {quickLinks.map((link, i) => (
                  <li key={i}>
                    <a 
                      href={link.href} 
                      className="hover:opacity-70 transition-opacity inline-block hover:translate-x-1 transition-transform"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* LEGAL */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Legal</h4>
              <ul className="space-y-2 text-sm opacity-90">
                {[
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Medical Disclaimer", href: "/disclaimer" },
                  { label: "Cookie Policy", href: "/cookies" }
                ].map((item, i) => (
                  <li key={i}>
                    <a 
                      href={item.href} 
                      className="hover:opacity-70 transition-opacity inline-block hover:translate-x-1 transition-transform"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* CONTACT */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
              <ul className="space-y-3 text-sm opacity-90">
                <li className="flex items-center space-x-2 hover:opacity-70 transition-opacity">
                  <Mail className="h-5 w-5 flex-shrink-0" />
                  <a href="mailto:support@lifeline.com">support@lifeline.com</a>
                </li>

                <li className="flex items-center space-x-2 hover:opacity-70 transition-opacity">
                  <Phone className="h-5 w-5 flex-shrink-0" />
                  <a href="tel:+918960858785">+91 8960858785</a>
                </li>

                <li className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 flex-shrink-0" />
                  <span>NIT Jamshedpur</span>
                </li>
              </ul>

              {/* SOCIAL LINKS */}
              <div className="flex items-center space-x-3 mt-4">
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="border-t border-white/20 pt-6 text-center">
            <p className="text-sm opacity-90">
              &copy; {new Date().getFullYear()} LifeLine. All rights reserved.
            </p>

            <p className="text-xs opacity-80 mt-2 flex items-center justify-center gap-1">
              Made with <Heart className="h-3 w-3 inline animate-pulse" fill="currentColor" /> for better healthcare
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}