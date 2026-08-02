import React from 'react';

interface LogoGraphicProps {
  className?: string;
}

export const LogoGraphic: React.FC<LogoGraphicProps> = ({ className = 'w-full h-full' }) => {
  return (
    <div className={`logo-graphic relative ${className}`}>
      <svg
        viewBox="0 0 600 600"
        className="logo-svg w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="RaphaAtlas Logo Graphic - Globe, Caduceus and AI Circuitry"
      >
        <defs>
          <radialGradient id="inlineGlobeGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="70%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </radialGradient>
          <linearGradient id="inlineGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C4A75E" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
        </defs>

        {/* 1. THE GLOBE (Ocean Background + Continents + Grids) */}
        {/* Ocean Background Circle */}
        <circle cx="300" cy="260" r="185" fill="url(#inlineGlobeGrad)" stroke="#1E293B" strokeWidth="8" />

        {/* Landmasses / Continents */}
        <path d="M 140 210 Q 180 170 240 180 T 280 230 T 240 310 T 170 340 Z" fill="#2D4A5C" opacity="0.95" />
        <path d="M 320 130 Q 380 120 440 160 T 450 250 T 390 300 T 310 210 Z" fill="#638C4C" opacity="0.9" />
        <path d="M 210 330 Q 270 340 310 410 T 270 445 T 195 410 Z" fill="#4D6E87" opacity="0.9" />

        {/* Latitude & Longitude Arc Grid Lines */}
        <ellipse cx="300" cy="260" rx="185" ry="75" fill="none" stroke="#64748B" strokeWidth="2.5" strokeDasharray="6,6" opacity="0.45" />
        <ellipse cx="300" cy="260" rx="185" ry="135" fill="none" stroke="#64748B" strokeWidth="2.5" strokeDasharray="6,6" opacity="0.35" />
        <line x1="300" y1="75" x2="300" y2="445" stroke="#64748B" strokeWidth="2.5" strokeDasharray="6,6" opacity="0.45" />

        {/* 2. THE CIRCUITRY / AI ELEMENTS (Gold traces & microchip nodes extending outwards) */}
        {/* Left Circuit Lines */}
        <g stroke="url(#inlineGoldGrad)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M 100 210 L 155 210 L 185 240" />
          <circle cx="100" cy="210" r="7.5" fill="#C4A75E" stroke="#FFFFFF" strokeWidth="2" />

          <path d="M 80 260 L 140 260 L 170 280" />
          <circle cx="80" cy="260" r="7.5" fill="#C4A75E" stroke="#FFFFFF" strokeWidth="2" />

          <path d="M 110 320 L 170 320" />
          <circle cx="110" cy="320" r="7.5" fill="#C4A75E" stroke="#FFFFFF" strokeWidth="2" />
        </g>

        {/* Right Circuit Lines */}
        <g stroke="url(#inlineGoldGrad)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M 500 210 L 445 210 L 415 180" />
          <circle cx="500" cy="210" r="7.5" fill="#C4A75E" stroke="#FFFFFF" strokeWidth="2" />

          <path d="M 520 260 L 460 260 L 430 240" />
          <circle cx="520" cy="260" r="7.5" fill="#C4A75E" stroke="#FFFFFF" strokeWidth="2" />

          <path d="M 490 320 L 430 320" />
          <circle cx="490" cy="320" r="7.5" fill="#C4A75E" stroke="#FFFFFF" strokeWidth="2" />
        </g>

        {/* 3. THE CADUCEUS (Medical Staff, Twin Leaves Crown, Twin Serpents) */}
        <g strokeLinejoin="round" strokeLinecap="round">
          {/* Main Aesculapius Central Staff Rod */}
          <line x1="300" y1="110" x2="300" y2="425" stroke="#1E293B" strokeWidth="11" />

          {/* Twin Leaves Crown (Green & Slate) */}
          <path d="M 300 130 Q 255 95 220 120 Q 255 150 300 130 Z" fill="#638C4C" stroke="#1E293B" strokeWidth="3" />
          <path d="M 300 130 Q 345 95 380 120 Q 345 150 300 130 Z" fill="#638C4C" stroke="#1E293B" strokeWidth="3" />
          <circle cx="300" cy="130" r="8" fill="#C4A75E" stroke="#1E293B" strokeWidth="2" />

          {/* Outer Coiled Serpent 1 (Sage Green) */}
          <path
            d="M 235 170 C 365 200, 365 240, 235 270 C 365 300, 365 340, 245 370 L 300 415"
            stroke="#638C4C"
            strokeWidth="11"
            fill="none"
          />

          {/* Inner Coiled Serpent 2 (Dark Slate Blue) */}
          <path
            d="M 365 170 C 235 200, 235 240, 365 270 C 235 300, 235 340, 355 370 L 300 415"
            stroke="#2D4A5C"
            strokeWidth="9"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
};
