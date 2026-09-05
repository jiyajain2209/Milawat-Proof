import React from 'react';
import { X, Check } from 'lucide-react';

export const WhyWeExist: React.FC = () => {
  const myths = [
    {
      id: 'myth-1',
      title: '“Trust the brand packet”',
      desc: 'Branding is assumed to guarantee pure dairy without verification.',
    },
    {
      id: 'myth-2',
      title: '“It smells and tastes fine”',
      desc: 'Neutralizers, urea, and starch are engineered to be odorless.',
    },
    {
      id: 'myth-3',
      title: '“Everyone drinks the same milk”',
      desc: 'Supply-chain dilution is treated as normal or unavoidable.',
    },
  ];

  const reality = [
    {
      id: 'reality-1',
      title: 'Test it right on your counter',
      desc: 'Instant chemical verification in your kitchen before cooking.',
    },
    {
      id: 'reality-2',
      title: 'Know in under 5 minutes',
      desc: 'Clear, high-contrast color strips with zero ambiguous reading.',
    },
    {
      id: 'reality-3',
      title: 'Decide with proof, not promises',
      desc: 'Hold your daily milk, paneer, and ghee suppliers accountable.',
    },
  ];

  return (
    <section
      id="our-story"
      className="w-full bg-white py-16 sm:py-20 lg:py-24 border-b border-[#F5F4F0] scroll-mt-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with 2-3 short, punchy sentences */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1C9A6C] block mb-2">
            The Reality
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#141414] tracking-tight leading-tight">
            Why Milawat Proof exists
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#525252] leading-relaxed">
            Food adulteration is a silent, everyday reality across urban Indian households. Milk, paneer, and ghee are routinely stretched with starch, detergents, and synthetic chemicals — yet most families have never had an accessible way to verify what is served on their table.
          </p>
        </div>

        {/* Two-column comparison layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          
          {/* Left Column: Muted / Grayscale "What you're told" */}
          <div
            id="what-youre-told-column"
            className="bg-[#F5F4F0] rounded-xl p-6 sm:p-8 border border-[#ebe9e3] flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#e5e4de]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#717171] block">
                    The Status Quo
                  </span>
                  <h3 className="text-xl font-bold text-[#141414] mt-0.5">
                    What you&apos;re told
                  </h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#141414]/5 flex items-center justify-center text-[#717171]">
                  <X className="w-4 h-4 text-[#717171]" strokeWidth={2.5} />
                </div>
              </div>

              {/* Scannable list */}
              <div className="mt-6 space-y-4">
                {myths.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/80 p-4 rounded-lg border border-[#e5e4de] flex items-start gap-3.5"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#D6432E]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="w-2 h-0.5 bg-[#D6432E] rounded-full" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-[#141414]">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#717171] mt-0.5 leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom footnote */}
            <div className="pt-6 mt-6 border-t border-[#e5e4de] text-xs text-[#717171]">
              Blind reliance on vendor trust leaves families exposed to long-term health risks.
            </div>
          </div>

          {/* Right Column: Brand Green "What Milawat Proof gives you" */}
          <div
            id="what-milawat-proof-gives-you-column"
            className="bg-[#1C9A6C]/8 rounded-xl p-6 sm:p-8 border border-[#1C9A6C]/30 flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#1C9A6C]/20">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1C9A6C] block">
                    Diagnostic Certainty
                  </span>
                  <h3 className="text-xl font-bold text-[#141414] mt-0.5">
                    What Milawat Proof gives you
                  </h3>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#1C9A6C] flex items-center justify-center text-white">
                  <Check className="w-4 h-4 text-white" strokeWidth={2.8} />
                </div>
              </div>

              {/* Scannable list */}
              <div className="mt-6 space-y-4">
                {reality.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-lg border border-[#1C9A6C]/20 shadow-none flex items-start gap-3.5"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#1C9A6C]/15 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-[#1C9A6C]" strokeWidth={3} />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-[#141414]">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#525252] mt-0.5 leading-snug">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom footnote */}
            <div className="pt-6 mt-6 border-t border-[#1C9A6C]/20 text-xs font-medium text-[#1C9A6C]">
              Simple, chemical indicator kits that turn invisible adulterants visible instantly.
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
