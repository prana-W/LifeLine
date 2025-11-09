import React, { useState, useEffect } from 'react';
import { Heart, Github, Linkedin, Mail, Phone, MapPin, Eye } from 'lucide-react';
import { useApi } from '@/hooks';

export default function MediBridgeFooter() {
  const [visitorCount, setVisitorCount] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const api = useApi();

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        await api.post('/visitors'); // Track new visitor
        const response = await api.get('/visitors'); // Fetch count
        const finalCount = response.data.count || 0;
        setVisitorCount(finalCount);
      } catch (error) {
        console.error('Error tracking visitor:', error);
      } finally {
        setLoading(false);
      }
    };
    trackVisitor();
  }, []);

  // Smooth count-up animation
  useEffect(() => {
    if (visitorCount === 0) return;

    let start = 0;
    const duration = 1000; // 1.5s
    const increment = visitorCount / (duration / 10);

    const counter = setInterval(() => {
      start += increment;
      if (start >= visitorCount) {
        start = visitorCount;
        clearInterval(counter);
      }
      setDisplayCount(Math.floor(start));
    }, 16);

    return () => clearInterval(counter);
  }, [visitorCount]);

  const teamMembers = [
    {
      name: 'Ashutosh Kumar',
      role: 'Frontend Developer',
      github: 'https://github.com/ashutoshkrrawat',
      linkedin: 'https://www.linkedin.com/in/ashutosh-kumar-rawat-138a88345/'
    },
    {
      name: 'Pranaw Kumar',
      role: 'Backend Developer',
      github: 'https://github.com/prana-W',
      linkedin: 'https://www.linkedin.com/in/pranaw-kumar-710331215/'
    }
  ];

  return (
    <footer className="relative mt-auto">
      {/* Wave SVG */}
      <div className="relative" style={{ backgroundColor: '#F2F2F2' }}>
        <svg 
          className="w-full" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
          style={{ height: '100px', transform: 'rotate(180deg)' }}
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#4A90E2' }} />
              <stop offset="50%" style={{ stopColor: '#4AD2CC' }} />
              <stop offset="100%" style={{ stopColor: '#4A90E2' }} />
            </linearGradient>
          </defs>
          <path 
            fill="url(#waveGradient)" 
            d="M0,0 C150,60 350,0 600,40 C850,80 1050,20 1200,50 L1200,120 L0,120 Z"
          />
        </svg>
      </div>

      {/* Footer Content */}
      <div style={{ background: 'linear-gradient(135deg, #4A90E2 0%, #4AD2CC 100%)' }} className="text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-8 w-8" style={{ color: '#FF6B6B' }} />
                <span className="text-2xl font-bold">MediBridge</span>
              </div>
              <p className="text-sm opacity-90 mb-4">
                Connecting healthcare professionals with patients for better health outcomes.
              </p>
              
              {/* Visitor Counter with Animation */}
              <div 
                className="flex items-center space-x-3 rounded-lg px-4 py-3"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <Eye className="h-6 w-6 flex-shrink-0" style={{ color: '#FFFFFF' }} />
                <div>
                  <p className="text-xs" style={{ color: '#FFFFFF', opacity: 0.85 }}>
                    Total Visitors
                  </p>
                  <p className="text-xl font-bold transition-all duration-300" style={{ color: '#FFFFFF' }}>
                    {loading ? '...' : displayCount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                {['Home','About Us','Services','Find Doctors','Contact Us'].map((text, i) => (
                  <li key={i}>
                    <a href="/" className="hover:opacity-80 transition-opacity opacity-90">
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                {['Privacy Policy','Terms of Service','Medical Disclaimer','Cookie Policy','HIPAA Compliance'].map((text, i) => (
                  <li key={i}>
                    <a href="/" className="hover:opacity-80 transition-opacity opacity-90">
                      {text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start space-x-2 opacity-90">
                  <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>pranaw.kr.dev@gmail.com</span>
                </li>
                <li className="flex items-start space-x-2 opacity-90">
                  <Phone className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>+91 8960858785</span>
                </li>
                <li className="flex items-start space-x-2 opacity-90">
                  <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>National Institute of Technology, Jamshedpur</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Team Section */}
          {/* <div className="border-t border-white border-opacity-20 pt-8 mb-8">
            <h4 className="font-semibold text-lg mb-6 text-center">Our Team</h4>
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {teamMembers.map((member, index) => (
                <div 
                  key={index}
                  className="rounded-lg p-6 transition-all"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <h5 className="font-bold text-lg mb-1">{member.name}</h5>
                  <p className="text-med opacity-100 mb-4">{member.role}</p>
                  <div className="flex space-x-3">
                    <a href={member.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-5 w-5" />
                    </a>
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          {/* Bottom Bar */}
          <div className="border-t border-white border-opacity-20 pt-6 text-center">
            <p className="text-sm opacity-90">
              &copy; {new Date().getFullYear()} MediBridge. All rights reserved.
            </p>
            <p className="text-xs opacity-75 mt-2">
              Made with <Heart className="h-3 w-3 inline mx-1" style={{ color: '#FF6B6B' }} /> for better healthcare
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
