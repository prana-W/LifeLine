import React, { useState, useEffect } from "react";
import { Heart, Github, Linkedin, Mail, Phone, MapPin, Eye, Activity } from "lucide-react";
import useApi from "@/hooks/useApi";

export default function Footer() {
  const [visitorCount, setVisitorCount] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const api = useApi();

  // ✅ STATIC THEME (same for every page)
  const theme = {
    waveGradient: ["#0ea5e9", "#38bdf8", "#0ea5e9"],
    footerGradient: "linear-gradient(135deg, #0f172a, #1e293b, #0f172a)",
    iconColor: "#38bdf8",
    accent: "#4fd1c5"
  };

  // ✅ Static Quick Links (universal)
  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Find Hospital", href: "/hospitals" },
    { label: "About Us", href: "/about" },
    { label: "Blood Donation", href: "/donate" },
    { label: "Emergency", href: "/emergency" }
  ];

  // ✅ Static tagline
  const tagline = "Connecting healthcare with simplicity and speed.";

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
  }, []);

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
            <linearGradient id="footerWave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={theme.waveGradient[0]} />
              <stop offset="50%" stopColor={theme.waveGradient[1]} />
              <stop offset="100%" stopColor={theme.waveGradient[2]} />
            </linearGradient>
          </defs>

          <path
            fill="url(#footerWave)"
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
                <Activity className="h-8 w-8" style={{ color: theme.iconColor }} />
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
                  href="https://github.com/prana-W/LifeLine"
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
              Made with <Heart className="h-3 w-3 inline animate-pulse" fill="currentColor" /> to support better healthcare.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
