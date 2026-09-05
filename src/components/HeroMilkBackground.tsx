import React from 'react';

export const HeroMilkBackground: React.FC = () => {
  return (
    <div
      id="hero-milk-ambient-canvas"
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {/* Soft ambient milk ripple gradient mesh */}
      <div className="absolute top-1/4 -left-20 w-[550px] h-[550px] rounded-full animate-milk-ripple filter blur-3xl bg-radial from-[#F5F4F0] via-[#EBE9E3]/40 to-transparent" />

      {/* SVG Ambient Fluid Pour & Ripple Contours */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.055] text-[#141414]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="milkStreamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1C9A6C" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#525252" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#1C9A6C" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="milkBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FAF9F5" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#EBE9E3" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Slow vertical organic milk stream/pour silhouette (ambient drift) */}
        <g className="animate-milk-flow">
          <path
            d="M 280, -50 
               C 310, 120  260, 240  320, 380 
               C 380, 520  440, 610  490, 850 
               L 410, 850 
               C 370, 620  310, 530  260, 390 
               C 210, 250  250, 110  230, -50 
               Z"
            fill="currentColor"
          />
        </g>

        {/* Gentle concentric milk ripple rings expanding from bottom-left */}
        <g className="animate-milk-ripple origin-[360px_420px]">
          {/* Concentric ripples */}
          <ellipse
            cx="360"
            cy="420"
            rx="180"
            ry="75"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            opacity="0.7"
          />
          <ellipse
            cx="360"
            cy="420"
            rx="290"
            ry="120"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            opacity="0.5"
          />
          <ellipse
            cx="360"
            cy="420"
            rx="420"
            ry="175"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            opacity="0.3"
          />
        </g>

        {/* Second soft ripple echo behind the CTAs */}
        <g className="animate-milk-flow opacity-60">
          <path
            d="M 50, 520 Q 220, 480 390, 530 T 720, 510"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <path
            d="M 80, 560 Q 250, 520 420, 570 T 750, 550"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
};
