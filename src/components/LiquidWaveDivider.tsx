import React from 'react';

interface LiquidWaveDividerProps {
  id?: string;
  variant?: 'warm' | 'green' | 'white';
  containerBg?: string;
  flipped?: boolean;
}

export const LiquidWaveDivider: React.FC<LiquidWaveDividerProps> = ({
  id = 'liquid-wave-divider',
  variant = 'warm',
  containerBg = 'bg-white',
  flipped = false,
}) => {
  // Variant color definitions
  const fillColor =
    variant === 'warm'
      ? '#F5F4F0'
      : variant === 'green'
      ? '#1C9A6C'
      : '#FFFFFF';

  const strokeColor =
    variant === 'green'
      ? 'rgba(28, 154, 108, 0.4)'
      : 'rgba(28, 154, 108, 0.25)';

  return (
    <div
      id={id}
      className={`relative w-full overflow-hidden leading-none select-none pointer-events-none h-6 sm:h-8 ${containerBg} ${
        flipped ? 'rotate-180' : ''
      }`}
      aria-hidden="true"
    >
      {/* Background layer wave (slower drift) */}
      <div className="absolute inset-0 w-[200%] flex animate-liquid-wave-back opacity-50">
        <svg
          className="w-full h-full block"
          viewBox="0 0 1200 32"
          preserveAspectRatio="none"
        >
          <path
            d="M0,16 C150,26 350,6 600,18 C850,30 1050,10 1200,16 L1200,32 L0,32 Z"
            fill={fillColor}
            fillOpacity="0.6"
          />
        </svg>
      </div>

      {/* Foreground primary liquid wave edge */}
      <div className="absolute inset-0 w-[200%] flex animate-liquid-wave-front">
        <svg
          className="w-full h-full block"
          viewBox="0 0 1200 32"
          preserveAspectRatio="none"
        >
          {/* Subtle 1px green meniscus surface tension line */}
          <path
            d="M0,14 C150,4 350,24 600,12 C850,2 1050,22 1200,14"
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.2"
          />
          {/* Body fill of fluid transitioning cleanly into the section below */}
          <path
            d="M0,14 C150,4 350,24 600,12 C850,2 1050,22 1200,14 L1200,32 L0,32 Z"
            fill={fillColor}
          />
        </svg>
      </div>
    </div>
  );
};
