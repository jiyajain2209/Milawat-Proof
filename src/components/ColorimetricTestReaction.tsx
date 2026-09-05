import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

interface ColorimetricTestReactionProps {
  className?: string;
}

export const ColorimetricTestReaction: React.FC<ColorimetricTestReactionProps> = ({
  className = '',
}) => {
  // Mode: 'adulterated' (showing positive color reaction e.g. detergent/urea) vs 'pure'
  const [activeTest, setActiveTest] = useState<'adulterated' | 'pure'>('adulterated');
  const [reactPhase, setReactPhase] = useState<'initial' | 'dropping' | 'reacting' | 'complete'>('complete');
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Lazy-load: only animate when scrolled into viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Animation cycle loop when visible
  useEffect(() => {
    if (!isVisible) return;

    let timeoutId: NodeJS.Timeout;

    // Trigger sequential reaction
    const runCycle = () => {
      setReactPhase('initial');
      timeoutId = setTimeout(() => {
        setReactPhase('dropping');
        timeoutId = setTimeout(() => {
          setReactPhase('reacting');
          timeoutId = setTimeout(() => {
            setReactPhase('complete');
            // Wait 5 seconds before next cycle
            timeoutId = setTimeout(() => {
              // Alternate between adulterated and pure for educational clarity
              setActiveTest((prev) => (prev === 'adulterated' ? 'pure' : 'adulterated'));
              runCycle();
            }, 5500);
          }, 1800);
        }, 900);
      }, 600);
    };

    runCycle();

    return () => clearTimeout(timeoutId);
  }, [isVisible]);

  // Color values representing genuine chemical colorimetry:
  // Pure milk: natural creamy white/ivory (#FAF8F2)
  // Adulterant (e.g. Starch / Detergent test): turns dark Prussian Blue / Indigo (#1D3557 to #1E3A8A)
  // Pure milk test: stays natural warm cream (#F3ECE0)
  const isAdulterated = activeTest === 'adulterated';

  const getLiquidColor = () => {
    if (reactPhase === 'initial') return '#FBF9F4'; // pure milk
    if (reactPhase === 'dropping') return '#F7F3EA';
    if (reactPhase === 'reacting') {
      return isAdulterated ? '#4A6B82' : '#F4EEDA';
    }
    // complete
    return isAdulterated ? '#1E3A8A' : '#EFE8D3';
  };

  const manualTrigger = (testType: 'adulterated' | 'pure') => {
    setActiveTest(testType);
    setReactPhase('initial');
    setTimeout(() => {
      setReactPhase('dropping');
      setTimeout(() => {
        setReactPhase('reacting');
        setTimeout(() => {
          setReactPhase('complete');
        }, 1600);
      }, 800);
    }, 400);
  };

  return (
    <div
      ref={containerRef}
      id="colorimetric-test-reaction-simulator"
      className={`mt-4 pt-3 border-t border-[#e5e4de] ${className}`}
    >
      {/* Mini Diagnostic Reaction Console */}
      <div className="bg-white rounded-lg p-3 sm:p-4 border border-[#e5e4de] shadow-2xs">
        
        {/* Header with Mode Selector */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#717171]">
            Colorimetric Reaction
          </span>
          <div className="flex items-center gap-1 bg-[#F5F4F0] p-0.5 rounded border border-[#ebe9e3]">
            <button
              type="button"
              onClick={() => manualTrigger('adulterated')}
              className={`px-2 py-0.5 text-[10px] font-semibold rounded transition-colors ${
                isAdulterated
                  ? 'bg-white text-[#D6432E] shadow-2xs border border-[#e5e4de]'
                  : 'text-[#717171] hover:text-[#141414]'
              }`}
            >
              Adulterated
            </button>
            <button
              type="button"
              onClick={() => manualTrigger('pure')}
              className={`px-2 py-0.5 text-[10px] font-semibold rounded transition-colors ${
                !isAdulterated
                  ? 'bg-white text-[#1C9A6C] shadow-2xs border border-[#e5e4de]'
                  : 'text-[#717171] hover:text-[#141414]'
              }`}
            >
              Pure
            </button>
          </div>
        </div>

        {/* Reaction Vial and Test Strip Graphic */}
        <div className="flex items-center gap-4">
          
          {/* Diagnostic Cylindrical Vial SVG */}
          <div className="relative w-12 h-24 shrink-0 flex items-center justify-center">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 48 96"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Droplet animation falling into vial */}
              {reactPhase === 'dropping' && (
                <circle
                  cx="24"
                  cy="12"
                  r="3.5"
                  fill={isAdulterated ? '#D6432E' : '#1C9A6C'}
                  className="transition-all duration-700 ease-in translate-y-6 opacity-0"
                />
              )}

              {/* Glass Tube Outer Rim */}
              <rect
                x="8"
                y="14"
                width="32"
                height="74"
                rx="16"
                fill="#FAF9F6"
                stroke="#d4d2cb"
                strokeWidth="1.5"
              />

              {/* Graduation hash marks on glass */}
              <line x1="12" y1="36" x2="18" y2="36" stroke="#a3a199" strokeWidth="1" strokeLinecap="round" />
              <line x1="12" y1="48" x2="22" y2="48" stroke="#a3a199" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="12" y1="60" x2="18" y2="60" stroke="#a3a199" strokeWidth="1" strokeLinecap="round" />

              {/* Fluid Inside Vial with Smooth Color Transition */}
              <g clipPath="url(#vialClip)">
                <rect
                  x="9"
                  y="30"
                  width="30"
                  height="57"
                  rx="15"
                  fill={getLiquidColor()}
                  className="transition-colors duration-1000 ease-out"
                />
                
                {/* Fluid Meniscus Curve */}
                <ellipse
                  cx="24"
                  cy="32"
                  rx="14"
                  ry="3.5"
                  fill="#ffffff"
                  fillOpacity="0.25"
                />
              </g>

              {/* Vial Lip */}
              <ellipse
                cx="24"
                cy="14"
                rx="16"
                ry="3"
                stroke="#d4d2cb"
                strokeWidth="1.5"
                fill="none"
              />

              {/* Specular Highlight on Glass */}
              <path
                d="M36,22 L36,78"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.85"
              />

              <defs>
                <clipPath id="vialClip">
                  <rect x="8" y="14" width="32" height="74" rx="16" />
                </clipPath>
              </defs>
            </svg>
          </div>

          {/* Calibrated Color Comparator Strip */}
          <div className="flex-1 flex flex-col justify-center space-y-2">
            
            {/* Active Status Badge */}
            <div className="flex items-center gap-1.5">
              {isAdulterated ? (
                <div className="flex items-center gap-1 text-[#D6432E] text-xs font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Adulterant Detected</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[#1C9A6C] text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Pure Sample Verified</span>
                </div>
              )}
            </div>

            {/* Micro Color Chart Comparison Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-[#717171] font-medium">
                <span>Ivory (Pure)</span>
                <span>Deep Blue (Positive)</span>
              </div>
              
              <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-[#FAF8F2] via-[#7B9EAF] to-[#1E3A8A] border border-[#e5e4de] relative">
                {/* Pointer marker indicating current color reading */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs transition-all duration-700 ease-out"
                  style={{
                    left: isAdulterated ? 'calc(100% - 14px)' : '0px',
                    backgroundColor: isAdulterated ? '#1E3A8A' : '#FAF8F2',
                  }}
                />
              </div>
            </div>

            {/* Authentic Scientific Explanation */}
            <p className="text-[11px] text-[#717171] leading-tight">
              {isAdulterated
                ? 'Color shift confirms presence of synthetic neutralisers or starch.'
                : 'Zero color shift; sample conforms to natural unadulterated milk.'}
            </p>

          </div>
        </div>

        {/* Replay trigger footer */}
        <div className="mt-2.5 pt-2 border-t border-[#F5F4F0] flex items-center justify-between text-[10px] text-[#8A8A8A]">
          <span>Diagnostic colorimetric assay</span>
          <button
            type="button"
            onClick={() => manualTrigger(activeTest)}
            className="hover:text-[#1C9A6C] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Replay reaction</span>
          </button>
        </div>

      </div>
    </div>
  );
};
