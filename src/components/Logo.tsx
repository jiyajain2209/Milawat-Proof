import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  dark?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
  dark = false,
}) => {
  // Size-dependent scalings
  const scale = {
    sm: {
      devanagari: 'text-base sm:text-lg leading-none font-bold',
      lineHeight: 'h-[2px] top-[54%]',
      proof: 'text-sm sm:text-base leading-tight font-extrabold tracking-tight',
      tagline: 'text-[7px] sm:text-[8px] tracking-[0.22em] font-semibold mt-0.5',
    },
    md: {
      devanagari: 'text-xl sm:text-2xl leading-none font-bold',
      lineHeight: 'h-[2.5px] top-[52%]',
      proof: 'text-lg sm:text-xl leading-tight font-extrabold tracking-tight',
      tagline: 'text-[9px] tracking-[0.24em] font-medium mt-1',
    },
    lg: {
      devanagari: 'text-3xl sm:text-4xl leading-none font-bold',
      lineHeight: 'h-[3.5px] top-[52%]',
      proof: 'text-2xl sm:text-3xl leading-tight font-extrabold tracking-tight',
      tagline: 'text-xs tracking-[0.26em] font-semibold mt-1.5',
    },
  }[size];

  return (
    <div
      id="brand-logo-lockup"
      className={`inline-flex flex-col select-none items-start ${className}`}
    >
      {/* Top element: 'मिलावट' in bold with red horizontal strike-through */}
      <div className="relative inline-block leading-none">
        <span
          className={`font-sans ${scale.devanagari} ${dark ? 'text-white' : 'text-[#141414]'} tracking-normal`}
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          मिलावट
        </span>
        {/* Crisp horizontal red strike-through line */}
        <span
          aria-hidden="true"
          className={`absolute left-[-2px] right-[-2px] ${scale.lineHeight} bg-[#D6432E] rounded-full pointer-events-none transition-all`}
        />
      </div>

      {/* Wordmark below: 'PROOF' in bold green */}
      <div className="leading-none mt-0.5">
        <span
          className={`font-sans ${scale.proof} text-[#1C9A6C] uppercase font-black`}
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          PROOF
        </span>
      </div>

      {/* Tagline underneath: 'TEST BEFORE YOU TASTE' in tracked-out small gray */}
      {showTagline && (
        <span
          className={`uppercase ${dark ? 'text-[#9ca3af]' : 'text-[#717171]'} ${scale.tagline}`}
          style={{ letterSpacing: '0.22em' }}
        >
          TEST BEFORE YOU TASTE
        </span>
      )}
    </div>
  );
};
