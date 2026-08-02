import React from 'react';
import { LogoGraphic } from './LogoGraphic';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  layout?: 'horizontal' | 'vertical';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  layout = 'horizontal',
}) => {
  const iconDimensions = {
    sm: 'h-10 w-10',
    md: 'h-14 w-14 sm:h-16 sm:w-16',
    lg: 'h-20 w-20 sm:h-24 sm:w-24',
    xl: 'h-28 w-28 sm:h-32 sm:w-32',
  }[size];

  const titleSizes = {
    sm: 'text-xl sm:text-2xl',
    md: 'text-3xl sm:text-5xl md:text-5xl',
    lg: 'text-4xl sm:text-6xl md:text-7xl',
    xl: 'text-5xl sm:text-7xl md:text-8xl',
  }[size];

  const subtitleSizes = {
    sm: 'text-[9px] tracking-wider',
    md: 'text-[11px] sm:text-xs tracking-widest',
    lg: 'text-xs sm:text-sm tracking-widest',
    xl: 'text-sm sm:text-base tracking-widest',
  }[size];

  return (
    <div className={`logo-container flex flex-col items-center justify-center text-center ${className}`}>
      <div
        className={`flex ${
          layout === 'vertical'
            ? 'flex-col items-center text-center gap-3'
            : 'flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4'
        }`}
      >
        {/* Crisp Vector Graphic Icon (Globe + Caduceus + Circuitry) */}
        <div className={`${iconDimensions} shrink-0 transition-transform duration-300 hover:scale-105`}>
          <LogoGraphic className="w-full h-full" />
        </div>

        {/* Brand Text Block */}
        <div className="logo-text text-center sm:text-left">
          <div className="flex items-baseline justify-center sm:justify-start gap-1.5">
            <h1 className={`company-name font-['Playfair_Display',serif] ${titleSizes} font-black tracking-tight uppercase`}>
              <span className="text-[#2d4a5c]">RAPHA</span>
              <span className="text-[#638c4c]">ATLAS</span>
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#2d4a5c] text-white font-sans tracking-normal shadow-xs">
              .com
            </span>
          </div>

          {showSubtitle && (
            <p className={`tagline font-sans font-bold uppercase ${subtitleSizes} text-[#4d6e87] mt-1`}>
              The Complete Map of Healing &amp; Health AI
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

