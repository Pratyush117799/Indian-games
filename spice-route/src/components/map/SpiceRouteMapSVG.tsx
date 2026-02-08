import React from "react";

/**
 * Simplified SVG map of the Spice Route region: Indian Ocean, Arabia, India, East Africa, Red Sea, Mediterranean.
 * Stylized land masses with visible boundaries. ViewBox tuned so ports (in %) align with land.
 */
export const SpiceRouteMapSVG: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className = "", children }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ocean fill */}
      <rect width="800" height="500" fill="#1e3a5f" />
      <defs>
        <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a5f" />
          <stop offset="50%" stopColor="#0f766e" />
          <stop offset="100%" stopColor="#1e3a5f" />
        </linearGradient>
        <linearGradient id="landIndia" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#84a98c" />
          <stop offset="100%" stopColor="#52796f" />
        </linearGradient>
        <linearGradient id="landArabia" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ad8a64" />
          <stop offset="100%" stopColor="#8b6914" />
        </linearGradient>
        <linearGradient id="landAfrica" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6b8e6b" />
          <stop offset="100%" stopColor="#4a6741" />
        </linearGradient>
        <linearGradient id="landMed" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c4a35a" />
          <stop offset="100%" stopColor="#9a7b4f" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#oceanGrad)" />

      {/* India - West coast (simplified peninsula + coast) */}
      <path
        fill="url(#landIndia)"
        stroke="#2d4a3e"
        strokeWidth="2"
        d="M 120 120 L 180 140 L 220 180 L 240 260 L 220 340 L 200 380 L 160 400 L 140 380 L 130 320 L 120 260 L 110 200 Z"
      />
      {/* Sri Lanka */}
      <ellipse cx="240" cy="400" rx="45" ry="28" fill="url(#landIndia)" stroke="#2d4a3e" strokeWidth="1.5" />

      {/* Arabian Peninsula */}
      <path
        fill="url(#landArabia)"
        stroke="#5c4a2d"
        strokeWidth="2"
        d="M 320 80 L 420 100 L 520 120 L 580 160 L 620 220 L 600 280 L 560 320 L 500 340 L 440 320 L 380 280 L 340 220 L 320 160 Z"
      />

      {/* Horn of Africa / East Africa */}
      <path
        fill="url(#landAfrica)"
        stroke="#2d4a2d"
        strokeWidth="2"
        d="M 380 340 L 440 360 L 500 380 L 520 420 L 500 460 L 420 480 L 360 460 L 340 400 L 360 360 Z"
      />

      {/* Red Sea (water gap) - drawn as path so land is around it */}
      {/* Egypt / North Africa coast */}
      <path
        fill="url(#landMed)"
        stroke="#5c4a2d"
        strokeWidth="2"
        d="M 480 60 L 560 80 L 620 120 L 660 180 L 680 260 L 700 320 L 720 380 L 760 420 L 800 440 L 800 500 L 520 500 L 500 420 L 520 360 L 540 280 L 520 200 L 500 120 Z"
      />

      {/* Mediterranean - southern Europe (simplified) */}
      <path
        fill="url(#landMed)"
        stroke="#5c4a2d"
        strokeWidth="2"
        d="M 580 40 L 680 20 L 760 60 L 800 100 L 800 0 L 600 0 L 540 20 Z"
      />

      {/* Region labels (subtle) */}
      <text x="165" y="260" fill="rgba(255,255,255,0.4)" fontSize="11" fontFamily="system-ui" fontWeight="600">INDIA</text>
      <text x="450" y="200" fill="rgba(255,255,255,0.4)" fontSize="11" fontFamily="system-ui" fontWeight="600">ARABIA</text>
      <text x="420" y="420" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="system-ui" fontWeight="600">AFRICA</text>
      <text x="620" y="180" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="system-ui" fontWeight="600">EGYPT</text>
      <text x="650" y="50" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="system-ui" fontWeight="600">MEDITERRANEAN</text>

      {children}
    </svg>
  );
};
