import React from 'react';

// Collection of SVG illustrations for authentication pages
export const LoginIllustration: React.FC = () => (
  <svg width="100%" height="100%" viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
    {/* Background shape */}
    <path d="M250,80 Q350,20 450,80 L450,250 Q350,310 250,250 Q150,310 50,250 L50,80 Q150,20 250,80 Z" 
      fill="#e6f4ff" stroke="#4096ff" strokeWidth="2"/>
    
    {/* Decorative elements */}
    <circle cx="250" cy="100" r="30" fill="#1677ff"/>
    <rect x="200" y="150" width="100" height="120" rx="10" fill="#f0f7ff" stroke="#4096ff" strokeWidth="2"/>
    <path d="M220,180 L280,180 M220,200 L280,200 M220,220 L260,220" stroke="#1677ff" strokeWidth="2" strokeLinecap="round"/>
    
    {/* Books/Education elements */}
    <rect x="120" y="200" width="60" height="80" rx="5" fill="#bae0ff" stroke="#4096ff" strokeWidth="2"/>
    <rect x="130" y="210" width="40" height="10" fill="#1677ff"/>
    <rect x="130" y="230" width="40" height="5" fill="#1677ff"/>
    <rect x="130" y="245" width="30" height="5" fill="#1677ff"/>
    
    <rect x="320" y="180" width="70" height="90" rx="5" fill="#bae0ff" stroke="#4096ff" strokeWidth="2"/>
    <rect x="330" y="190" width="50" height="10" fill="#1677ff"/>
    <rect x="330" y="210" width="50" height="5" fill="#1677ff"/>
    <rect x="330" y="225" width="40" height="5" fill="#1677ff"/>
    
    {/* Connection lines */}
    <path d="M150,300 Q250,350 350,300" stroke="#1677ff" strokeWidth="2" fill="transparent" strokeLinecap="round"/>
    <circle cx="150" cy="300" r="5" fill="#1677ff"/>
    <circle cx="250" cy="325" r="5" fill="#1677ff"/>
    <circle cx="350" cy="300" r="5" fill="#1677ff"/>
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