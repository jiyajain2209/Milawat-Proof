import React from 'react';
import { Pipette, Clock, Palette } from 'lucide-react';
import { ColorimetricTestReaction } from './ColorimetricTestReaction';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '1',
      icon: Pipette,
      title: 'Add sample & reagent',
      description:
        'Add a small sample of your milk, paneer, or ghee to the provided test tube and add the reagent drops.',
    },
    {
      number: '2',
      icon: Clock,
      title: 'Wait 2 minutes',
      description:
        'Let the reagent react naturally on your counter — no equipment, no lab, and no waiting days.',
    },
    {
      number: '3',
      icon: Palette,
      title: 'Match the color',
      description:
        'Compare the result against our simple color chart to know instantly if it is pure or adulterated.',
    },
  ];

  return (
    <section
      id="how-it-works"
      className="w-full bg-white pt-16 pb-12 sm:pt-20 sm:pb-16 lg:pt-24 lg:pb-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1C9A6C] block mb-2">
            Effortless At-Home Protocol
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#141414] tracking-tight">
            How It Works
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#525252] leading-relaxed">
            Designed for busy Indian kitchens. You don&apos;t need a science degree or expensive equipment — just follow three simple steps before you cook.
          </p>
        </div>

        {/* 3-Step Horizontal Process */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                id={`how-it-works-step-${step.number}`}
                className="relative bg-[#F5F4F0] rounded-xl p-6 sm:p-8 border border-[#ebe9e3] flex flex-col justify-between"
              >
                <div>
                  {/* Step Number & Icon Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#e5e4de] flex items-center justify-center shadow-xs">
                      <Icon className="w-6 h-6 text-[#1C9A6C]" strokeWidth={2.2} />
                    </div>
                    <span className="text-3xl font-black text-[#1C9A6C] opacity-90 font-sans">
                      0{step.number}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#141414] tracking-tight mb-2">
                    {step.title}
                  </h3>

                  {/* Description: one short sentence */}
                  <p className="text-sm text-[#525252] leading-relaxed font-normal">
                    {step.description}
                  </p>

                  {/* Step 3 Authentic Test Strip / Colorimetric Reaction Simulator */}
                  {step.number === '3' && <ColorimetricTestReaction />}
                </div>

                {/* Subtle indicator bar */}
                <div className="mt-6 pt-4 border-t border-[#e5e4de] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#1C9A6C]" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#717171]">
                    Step {step.number} of 3
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reassurance banner */}
        <div className="mt-10 p-4 sm:p-5 rounded-lg bg-[#1C9A6C]/8 border border-[#1C9A6C]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1C9A6C] shrink-0" />
            <p className="text-xs sm:text-sm text-[#141414] font-medium">
              <strong className="font-semibold text-[#141414]">Zero guesswork:</strong> Every kit includes an illustrated pocket interpretation card and a QR code linking to a 30-second video demo.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#1C9A6C] whitespace-nowrap">
            Non-toxic &bull; Safe for kitchen counters
          </span>
        </div>
      </div>
    </section>
  );
};
