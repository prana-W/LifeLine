import React, { useEffect, useState } from "react";
import { Heart, Users, Zap, Github, Linkedin } from "lucide-react";

export default function AboutUs() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const team = [
    { 
      name: "Ashutosh Kumar", 
      role: "Frontend Developer",
      github: "https://github.com/ashutoshkrrawat",
      linkedin: "https://www.linkedin.com/in/ashutosh-kumar-rawat-138a88345/"
    },
    { 
      name: "Pranaw Kumar", 
      role: "Backend Developer",
      github: "https://github.com/prana-W",
      linkedin: "https://www.linkedin.com/in/pranaw-kumar-710331215/"
    },
      {
          name: "Sisanta Chhatoi",
          role: "AI/ML and DevOps Developer",
          github: "https://github.com/sisantaChhatoi",
          linkedin: "https://www.linkedin.com/in/sisanta-chhatoi-229aa5321/"
      },
      {
      name: "Ruchika Ruhanshi", 
      role: "UI/UX and Designer",
      github: "https://github.com/RuchikaRuhanshi",
      linkedin: "https://www.linkedin.com/in/ruchika-ruhanshi/"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none">
  <div
    className="h-full w-full"
    style={{
      backgroundImage: `
        linear-gradient(#4AD2CC 1px, transparent 1px),
        linear-gradient(90deg, #4AD2CC 1px, transparent 1px)
      `,
      backgroundSize: "40px 40px",
    }}
  />
</div>
      {/* ========================================
          HERO SECTION WITH WAVE PATTERNS
      ======================================== */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        {/* ECG LINE (same as HospitalAuth) */}
<svg 
  className="absolute w-full h-16 bottom-10 opacity-50"
  viewBox="0 0 1000 100"
  preserveAspectRatio="none"
>
  <polyline
    points="0,50 200,50 220,30 240,70 260,50 500,50 520,45 540,55 560,50 1000,50"
    fill="none"
    stroke="#4AD2CC"
    strokeWidth="2"
  >
    <animate
      attributeName="stroke-dasharray"
      values="0,1000;1000,0"
      dur="3s"
      repeatCount="indefinite"
    />
  </polyline>
</svg>

        {/* Animated Wave Layers (Parallax) */}
        <div 
          className="absolute inset-0 z-0"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          {/* Wave 1 - Back */}
          <svg 
            className="absolute bottom-0 w-full h-full opacity-20"
            viewBox="0 0 1440 600" 
            preserveAspectRatio="none"
          >
            <path 
              d="M0,300 C360,450 720,150 1080,300 C1440,450 1440,600 1440,600 L0,600 Z" 
              fill="url(#wave1)"
              className="animate-wave-slow"
            />
            <defs>
              <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0891b2" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Wave 2 - Middle */}
          <svg 
            className="absolute bottom-0 w-full h-full opacity-25"
            viewBox="0 0 1440 600" 
            preserveAspectRatio="none"
          >
            <path 
              d="M0,400 C320,250 640,500 960,350 C1280,200 1440,400 1440,400 L1440,600 L0,600 Z" 
              fill="url(#wave2)"
              className="animate-wave-medium"
            />
            <defs>
              <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#0891b2" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>

          {/* Wave 3 - Front */}
          <svg 
            className="absolute bottom-0 w-full h-full opacity-30"
            viewBox="0 0 1440 600" 
            preserveAspectRatio="none"
          >
            <path 
              d="M0,450 C400,300 800,550 1200,400 C1440,320 1440,600 1440,600 L0,600 Z" 
              fill="url(#wave3)"
              className="animate-wave-fast"
            />
            <defs>
              <linearGradient id="wave3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-[10%] w-3 h-3 bg-teal-400 rounded-full opacity-40 animate-float-slow" />
          <div className="absolute top-40 right-[15%] w-2 h-2 bg-cyan-400 rounded-full opacity-50 animate-float-medium" />
          <div className="absolute bottom-32 left-[20%] w-4 h-4 bg-blue-400 rounded-full opacity-30 animate-float-fast" />
          <div className="absolute top-60 right-[30%] w-3 h-3 bg-teal-300 rounded-full opacity-40 animate-float-slow" />
        </div>

        {/* Hero Text */}
        <div className="relative z-10 text-center px-6">
          <h1 
            className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 mb-4 animate-fade-in"
            style={{ transform: `translateY(${scrollY * 0.2}px)` }}
          >
            About Us
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-delay">
            Building the future of healthcare, one connection at a time
          </p>
        </div>

        {/* Animated heartbeat line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-50 animate-pulse" />
      </section>

      {/* ========================================
          VISION SECTION
      ======================================== */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Decorative curve top */}
          <svg 
            className="absolute top-0 left-0 w-full h-32 -mt-16 opacity-10"
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
          >
            <path d="M0,50 Q360,0 720,50 T1440,50 L1440,100 L0,100 Z" fill="#0891b2" />
          </svg>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Left - Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-200 to-teal-200 rounded-full blur-3xl opacity-50 animate-pulse-slow" />
                <Heart 
                  className="relative w-64 h-64 text-teal-500 animate-float-slow" 
                  strokeWidth={1.5}
                  fill="currentColor"
                  style={{ 
                    filter: "drop-shadow(0 20px 40px rgba(20, 184, 166, 0.3))",
                    transform: `translateY(${scrollY * 0.1}px)`
                  }}
                />
              </div>
            </div>

            {/* Right - Vision Text */}
            <div 
              className="space-y-6"
              style={{ transform: `translateX(${-scrollY * 0.05}px)` }}
            >
              <h2 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                <Zap className="w-10 h-10 text-cyan-500" />
                Our Vision
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                <p>
                  We're building a <span className="font-semibold text-teal-600">smarter and faster way</span> to access healthcare. Our platform connects users, hospitals, and pharmacies in one seamless system — making emergency help, blood requests, and medicine management just a tap away.
                </p>
                <p>
                  With simple interfaces, real-time updates, and one-click actions, we aim to bring <span className="font-semibold text-cyan-600">clarity and speed</span> during life's most critical moments.
                </p>
                <p className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600">
                  Our mission is simple: save time, save lives, and make healthcare feel human again.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          STATS SECTION
      ======================================== */}
      <section className="relative py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Users, label: "Team Members", value: "3" },
              { icon: Heart, label: "Lives Touched", value: "1000+" },
              { icon: Zap, label: "Quick Response", value: "<2 min" }
            ].map((stat, idx) => (
              <div 
                key={idx}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105 border border-teal-100"
                style={{ 
                  animation: `fade-slide-up 0.6s ease-out ${idx * 0.2}s backwards`,
                  transform: `translateY(${-scrollY * 0.03}px)`
                }}
              >
                <stat.icon className="w-12 h-12 text-teal-500 mb-4 mx-auto" />
                <div className="text-4xl font-bold text-gray-800 text-center mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-center font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          TEAM SECTION
      ======================================== */}
      <section className="relative py-20 px-6">
        
        {/* Decorative curve */}
        <svg 
          className="absolute top-0 left-0 w-full h-32 -mt-16 opacity-10"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path d="M0,50 C480,100 960,0 1440,50 L1440,100 L0,100 Z" fill="#06b6d4" />
        </svg>

        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-4">
            Meet The <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600">Team</span>
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg">
            The minds behind Lifeline
          </p>

          <div className="grid md:grid-cols-2 gap-10">
            {team.map((member, idx) => (
              <div 
                key={idx}
                className="group relative bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 border border-teal-100"
                style={{ animation: `fade-slide-up 0.6s ease-out ${idx * 0.2}s backwards` }}
              >
                {/* Avatar Circle */}
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center text-white text-4xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                  {member.name.charAt(0)}
                </div>

                {/* Name & Role */}
                <h3 className="text-2xl font-bold text-gray-800 text-center mb-2">
                  {member.name}
                </h3>
                <p className="text-teal-600 text-center font-medium mb-6">
                  {member.role}
                </p>

                {/* Social Links */}
                <div className="flex justify-center gap-4">
                  <a 
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-all hover:scale-110"
                  >
                    <Github className="w-6 h-6 text-white" />
                  </a>
                  <a 
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-all hover:scale-110"
                  >
                    <Linkedin className="w-6 h-6 text-white" />
                  </a>
                </div>

                {/* Decorative corner */}
                <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-teal-300 rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-cyan-300 rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          FOOTER WAVE
      ======================================== */}
      <section className="relative h-32 mt-20">
        <svg 
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path 
            d="M0,50 Q360,0 720,50 T1440,50 L1440,100 L0,100 Z" 
            fill="url(#footerWave)"
            opacity="0.3"
          />
          <defs>
            <linearGradient id="footerWave" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0891b2" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>
        </svg>
      </section>

      {/* ========================================
          ANIMATIONS & STYLES
      ======================================== */}
      <style>{`
        /* Wave animations */
        @keyframes wave-slow {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-25px) translateY(10px); }
        }
        @keyframes wave-medium {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(25px) translateY(-10px); }
        }
        @keyframes wave-fast {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-20px) translateY(15px); }
        }
        .animate-wave-slow { animation: wave-slow 20s ease-in-out infinite; }
        .animate-wave-medium { animation: wave-medium 15s ease-in-out infinite; }
        .animate-wave-fast { animation: wave-fast 10s ease-in-out infinite; }

        /* Floating animations */
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 4s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 3s ease-in-out infinite; }

        /* Pulse slow */
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }

        /* Fade in animations */
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-fade-in-delay { animation: fade-in 1s ease-out 0.3s backwards; }

        /* Fade slide up */
        @keyframes fade-slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}