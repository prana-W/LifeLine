import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Pill, Users } from "lucide-react";

export default function MagneticPortalButtons({ navigate }) {
  const [mousePosition, setMousePosition] = useState({});
  const [hoveredButton, setHoveredButton] = useState(null);

  const handleMouseMove = (e, buttonId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    setMousePosition(prev => ({ ...prev, [buttonId]: { x, y } }));
  };

  const handleMouseLeave = (buttonId) => {
    setMousePosition(prev => ({ ...prev, [buttonId]: { x: 0, y: 0 } }));
    setHoveredButton(null);
  };

  const buttons = [
    {
      id: "hospital",
      title: "Hospital Portal",
    //   subtitle: "Manage operations seamlessly",
      gradient: "from-cyan-500 via-teal-500 to-emerald-500",
      hoverGradient: "from-teal-600 via-teal-500 to-cyan-600",
      icon: Building2,
      navigateTo: "/hospital/auth",
      particles: "#2dd4bf",
      svg: (
        <svg className="w-full h-full" viewBox="0 0 200 200">
          <rect x="70" y="58" width="60" height="85" fill="white" opacity="0.85" rx="6" />
          <rect x="92" y="42" width="16" height="16" fill="white" opacity="1" rx="2" />
          <rect x="98" y="46" width="2" height="8" fill="#ef4444" />
          <rect x="95" y="49" width="8" height="2" fill="#ef4444" />
        </svg>
      )
    },

    {
      id: "pharmacy",
      title: "Pharmacy Portal",
    //   subtitle: "Inventory & prescription tools",
      gradient: "from-emerald-500 via-teal-600 to-green-600",
      hoverGradient: "from-emerald-600 via-green-600 to-teal-700",
      icon: Pill,
      navigateTo: "/pharmacy/auth",
      particles: "#34d399",
      svg: (
        <svg className="w-full h-full" viewBox="0 0 200 200">
          <rect x="80" y="78" width="40" height="60" fill="white" opacity="0.85" rx="6" />
          <rect x="86" y="65" width="28" height="14" fill="white" opacity="1" rx="3" />
        </svg>
      )
    },

    {
      id: "user",
      title: "User Portal",
    //   subtitle: "All health services in one place",
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      hoverGradient: "from-purple-600 via-rose-600 to-pink-700",
      icon: Users,
      navigateTo: "/user/auth",
      particles: "#d946ef",
      svg: (
        <svg className="w-full h-full" viewBox="0 0 200 200">
          <circle cx="100" cy="82" r="22" fill="white" opacity="0.85" />
          <rect x="80" y="112" width="40" height="18" fill="white" opacity="0.85" rx="4" />
        </svg>
      )
    }
  ];

  return (
    <div className="w-full grid md:grid-cols-3 gap-8 mt-10">
      {buttons.map((btn) => {
        const pos = mousePosition[btn.id] || { x: 0, y: 0 };
        const isHovered = hoveredButton === btn.id;
        const Icon = btn.icon;

        return (
          <motion.button
            key={btn.id}
            onClick={() => navigate(btn.navigateTo)}
            onMouseMove={(e) => handleMouseMove(e, btn.id)}
            onMouseEnter={() => setHoveredButton(btn.id)}
            onMouseLeave={() => handleMouseLeave(btn.id)}
            animate={{ x: pos.x, y: pos.y }}
            transition={{ type: "spring", stiffness: 250, damping: 18 }}
            className="relative w-full h-48 bg-white/10 border border-white/20 
                       rounded-2xl backdrop-blur-xl overflow-hidden shadow-lg"
          >
            {/* Background gradient layers */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${btn.gradient} opacity-0`}
              animate={{ opacity: isHovered ? 0.85 : 0 }}
            />

            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${btn.hoverGradient} opacity-0`}
              animate={{ opacity: isHovered ? 1 : 0 }}
            />

            {/* Glow outline */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              animate={{
                boxShadow: isHovered
                  ? `0 0 35px ${btn.particles}, inset 0 0 25px ${btn.particles}60`
                  : "0 0 0 transparent"
              }}
            />

            {/* Illustrations */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-20 h-20 drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]">
              {btn.svg}
            </div>

            {/* CONTENT */}
            <div className="absolute bottom-14 w-full text-center px-2">
              <h3 className="text-[1.15rem] font-bold text-white mb-1 tracking-wide">
                {btn.title}
              </h3>

              <p className="text-white/80 text-xs leading-snug px-2">
                {btn.subtitle}
              </p>
            </div>

            {/* Bottom info row */}
            <div className="absolute bottom-3 w-full flex justify-between px-5 items-center">
              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                <Icon className="w-5 h-5 text-white" />
              </div>

              <div className="flex items-center gap-1 text-white">
                <span className="text-sm font-semibold">Access</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
