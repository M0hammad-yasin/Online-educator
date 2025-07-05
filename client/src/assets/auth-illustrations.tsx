import React from 'react';

// Collection of SVG illustrations for authentication pages
export const LoginIllustration: React.FC = () => (
  <svg width="100%" height="100%" viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
    {/* Simple gradient background */}
    <rect x="0" y="0" width="500" height="400" fill="#f0f9ff" />
    <path d="M0,350 Q125,300 250,350 T500,350" fill="#e6f7ff" />
    <path d="M0,380 Q125,330 250,380 T500,380" fill="#bae7ff" />
    
    {/* Abstract shapes */}
    <circle cx="400" cy="80" r="30" fill="#1677ff" opacity="0.1" />
    <circle cx="420" cy="120" r="20" fill="#1677ff" opacity="0.1" />
    <circle cx="380" cy="110" r="15" fill="#1677ff" opacity="0.1" />
    
    {/* Books stack - simplified */}
    <rect x="150" y="240" width="70" height="15" fill="#1677ff" opacity="0.7" rx="3" />
    <rect x="145" y="225" width="70" height="15" fill="#1677ff" opacity="0.5" rx="3" />
    <rect x="155" y="210" width="70" height="15" fill="#1677ff" opacity="0.3" rx="3" />
    <rect x="140" y="195" width="70" height="15" fill="#1677ff" opacity="0.1" rx="3" />
    
    {/* Pencil - simplified */}
    <path d="M250,200 L260,170 L270,200 Z" fill="#1677ff" opacity="0.2" />
    <rect x="255" y="200" width="10" height="30" fill="#1677ff" opacity="0.1" />
    
    {/* Abstract person with graduation cap */}
    <circle cx="350" cy="280" r="20" fill="#1677ff" opacity="0.2" /> {/* Head */}
    <rect x="335" y="300" width="30" height="40" fill="#1677ff" opacity="0.1" rx="5" /> {/* Body */}
    <path d="M330,280 L370,280 L350,265 Z" fill="#1677ff" opacity="0.3" /> {/* Graduation cap */}
    <line x1="350" y1="265" x2="360" y2="275" stroke="#1677ff" opacity="0.3" strokeWidth="2" /> {/* Tassel */}
    
    {/* Abstract learning symbols */}
    <circle cx="150" cy="120" r="40" fill="none" stroke="#1677ff" opacity="0.2" strokeWidth="2" strokeDasharray="5,5" />
    <path d="M130,120 L170,120 M150,100 L150,140" stroke="#1677ff" opacity="0.3" strokeWidth="2" />
    
    {/* Light bulb - representing ideas */}
    <circle cx="250" cy="100" r="25" fill="#1677ff" opacity="0.1" />
    <path d="M250,125 L250,140" stroke="#1677ff" opacity="0.3" strokeWidth="2" />
    <path d="M240,135 L260,135" stroke="#1677ff" opacity="0.3" strokeWidth="2" />
    
    {/* Decorative dots */}
    <circle cx="100" cy="200" r="3" fill="#1677ff" opacity="0.3" />
    <circle cx="120" cy="220" r="2" fill="#1677ff" opacity="0.3" />
    <circle cx="90" cy="230" r="4" fill="#1677ff" opacity="0.3" />
    <circle cx="400" cy="200" r="3" fill="#1677ff" opacity="0.3" />
    <circle cx="420" cy="220" r="2" fill="#1677ff" opacity="0.3" />
    <circle cx="390" cy="230" r="4" fill="#1677ff" opacity="0.3" />
  </svg>
);

export const ForgotPasswordIllustration: React.FC = () => (
  <svg width="100%" height="100%" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    {/* Background elements */}
    <rect x="0" y="0" width="400" height="400" fill="#f0f7ff" opacity="0.5"/>
    <path d="M0,200 Q100,150 200,200 T400,200" fill="#e6f4ff" stroke="none"/>
    
    {/* Email/Message elements */}
    <rect x="100" y="120" width="200" height="160" rx="10" fill="white" stroke="#4096ff" strokeWidth="2"/>
    <path d="M100,140 L200,200 L300,140" fill="none" stroke="#1677ff" strokeWidth="2"/>
    
    {/* Lock elements */}
    <rect x="175" y="180" width="50" height="40" rx="5" fill="#bae0ff" stroke="#4096ff" strokeWidth="2"/>
    <circle cx="200" cy="195" r="8" fill="#1677ff"/>
    <rect x="195" y="195" width="10" height="15" fill="#1677ff"/>
    
    {/* Decorative dots */}
    <circle cx="100" cy="300" r="5" fill="#1677ff" opacity="0.5"/>
    <circle cx="120" cy="320" r="8" fill="#1677ff" opacity="0.5"/>
    <circle cx="150" cy="310" r="6" fill="#1677ff" opacity="0.5"/>
    
    <circle cx="300" cy="320" r="5" fill="#1677ff" opacity="0.5"/>
    <circle cx="280" cy="300" r="8" fill="#1677ff" opacity="0.5"/>
    <circle cx="250" cy="310" r="6" fill="#1677ff" opacity="0.5"/>
  </svg>
);

export const LogoutIllustration: React.FC = () => (
  <svg width="100%" height="100%" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    {/* Background elements */}
    <rect x="0" y="0" width="400" height="400" fill="#f0f7ff" opacity="0.5"/>
    <path d="M0,300 Q100,250 200,300 T400,300" fill="#e6f4ff" stroke="none"/>
    
    {/* Door/Exit elements */}
    <rect x="150" y="100" width="100" height="180" rx="5" fill="white" stroke="#4096ff" strokeWidth="2"/>
    <rect x="160" y="110" width="80" height="160" rx="3" fill="#f0f7ff"/>
    <circle cx="235" cy="190" r="8" fill="#1677ff"/>
    
    {/* Arrow pointing out */}
    <path d="M250,190 L310,190" stroke="#1677ff" strokeWidth="3" strokeLinecap="round"/>
    <path d="M290,170 L310,190 L290,210" stroke="#1677ff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* Person silhouette */}
    <circle cx="100" cy="150" r="20" fill="#bae0ff" stroke="#4096ff" strokeWidth="2"/>
    <path d="M100,170 L100,220" stroke="#4096ff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M100,180 L80,200" stroke="#4096ff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M100,180 L120,200" stroke="#4096ff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M100,220 L85,250" stroke="#4096ff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M100,220 L115,250" stroke="#4096ff" strokeWidth="2" strokeLinecap="round"/>
    
    {/* Motion lines */}
    <path d="M130,150 L150,150" stroke="#1677ff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M125,165 L145,165" stroke="#1677ff" strokeWidth="2" strokeLinecap="round"/>
    <path d="M130,180 L150,180" stroke="#1677ff" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const SuccessCheckmark: React.FC = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="38" fill="#E6F4FF" />
    <path d="M28 40L36 48L52 32" stroke="#1677FF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const LoadingSpinner: React.FC = () => (
  <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
    <circle cx="25" cy="25" r="20" fill="none" stroke="#1677ff" strokeWidth="5" strokeLinecap="round" 
      style={{ animation: 'spin 1.5s linear infinite', strokeDasharray: '100', strokeDashoffset: '50' }} />
    <style>{`
      @keyframes spin {
        0% {
          transform: rotate(0deg);
          stroke-dashoffset: 50;
        }
        50% {
          stroke-dashoffset: 100;
        }
        100% {
          transform: rotate(360deg);
          stroke-dashoffset: 50;
        }
      }
    `}</style>
  </svg>
);