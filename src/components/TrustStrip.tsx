import React from 'react';
import { Clock, Home, CheckCircle2 } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const trustMarkers = [
    {
      id: 'trust-marker-time',
      icon: Clock,
      label: 'Results in 5 minutes',
    },
    {
      id: 'trust-marker-location',
      icon: Home,
      label: 'No lab needed',
    },
    {
      id: 'trust-marker-adulterants',
      icon: CheckCircle2,
      label: 'Tested for common adulterants',
    },
  ];

  return (
    <div
      id="trust-markers-strip"
      className="w-full bg-[#F5F4F0] border-y border-[#ebe9e3] py-4 sm:py-5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 items-center">
          {trustMarkers.map((marker) => {
            const Icon = marker.icon;
            return (
              <div
                key={marker.id}
                id={marker.id}
                className="flex items-center justify-start sm:justify-center gap-2.5 text-[#141414]"
              >
                <Icon
                  className="w-4 h-4 text-[#1C9A6C] shrink-0"
                  strokeWidth={2.2}
                />
                <span className="text-xs sm:text-sm font-semibold tracking-normal text-[#141414] whitespace-nowrap">
                  {marker.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
