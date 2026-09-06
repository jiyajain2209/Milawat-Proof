import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { HeroMilkBackground } from './HeroMilkBackground';

interface HeroProps {
  onShopClick?: () => void;
  onHowItWorksClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onShopClick,
  onHowItWorksClick,
}) => {
  return (
    <section
      id="homepage-hero-section"
      className="relative w-full bg-white overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-20"
    >
      {/* Ambient milk ripple and gentle flow animation (restrained, low-opacity) */}
      <HeroMilkBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Subheadline, CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6 sm:space-y-8">
            
            {/* Main Headline with 'actually' underlined in green */}
            <h1
              id="hero-main-headline"
              className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#141414] leading-[1.12] tracking-tight"
            >
              India, what&apos;s{' '}
              <span className="relative inline-block whitespace-nowrap text-[#141414]">
                <span className="relative z-10">actually</span>
                {/* Handcrafted organic curved green underline for emphasis */}
                <svg
                  className="absolute -bottom-2 sm:-bottom-2.5 left-0 w-full h-3 sm:h-4 text-[#1C9A6C] overflow-visible pointer-events-none"
                  viewBox="0 0 180 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M 4 11 Q 50 3, 90 9 T 176 7"
                    stroke="#1C9A6C"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>{' '}
              in your milk?
            </h1>

            {/* Subheadline */}
            <p
              id="hero-subheadline"
              className="text-lg sm:text-xl text-[#525252] leading-relaxed max-w-2xl font-normal"
            >
              Test your milk, paneer, ghee, and whey protein for adulteration, at home, in under 5 minutes. No lab required.
            </p>

            {/* Call to Action Group */}
            <div
              id="hero-cta-group"
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 w-full sm:w-auto"
            >
              {/* Primary CTA: "Shop Test Kits" (green, filled) */}
              <button
                id="hero-primary-shop-cta"
                type="button"
                onClick={onShopClick}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-md bg-[#1C9A6C] hover:bg-[#167e58] text-white text-base font-semibold tracking-wide transition-all shadow-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1C9A6C] active:scale-[0.99]"
              >
                <span>Shop Test Kits</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Secondary CTA: "See how it works" (text link) */}
              <button
                id="hero-secondary-how-cta"
                type="button"
                onClick={onHowItWorksClick}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-3 text-base font-medium text-[#141414] hover:text-[#1C9A6C] transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C9A6C] rounded"
              >
                <span className="underline underline-offset-4 decoration-[#717171]/40 group-hover:decoration-[#1C9A6C]">
                  See how it works
                </span>
                <ChevronRight className="w-4 h-4 text-[#717171] group-hover:text-[#1C9A6C] group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>

          {/* Right Column: Hero Image Area */}
          <div className="lg:col-span-5 w-full">
            <div
              id="hero-image-container"
              className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] rounded-xl overflow-hidden bg-[#F5F4F0] border border-[#ebe9e3]"
            >
              {/* Image comparing real vs adulterated dairy */}
              <img
                id="hero-photo"
                src="/Gemini_Generated_Image_m7zr1um7zr1um7zr.png"
                alt="Real vs adulterated milk, paneer, and ghee comparison"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-[1.02]"
                loading="eager"
              />

              {/* Subtle clinical authenticity overlay tag */}
              <div
                id="hero-image-badge"
                className="absolute bottom-3.5 left-3.5 right-3.5 sm:right-auto bg-white/95 backdrop-blur-xs px-3.5 py-2 rounded-md border border-[#e5e4de] flex items-center gap-2.5 text-xs shadow-xs"
              >
                <span className="w-2 h-2 rounded-full bg-[#1C9A6C] shrink-0" />
                <span className="font-medium text-[#141414] tracking-tight truncate">
                  Household Dairy Testing &bull; Milk, Paneer &amp; Ghee
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
