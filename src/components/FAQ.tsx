import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 'faq-accuracy',
    question: 'How accurate are these test kits?',
    answer:
      'Our colorimetric chemical reagents are calibrated against standard diagnostic laboratory thresholds. They reliably detect adulterants above the minimum permissible limits (typically >0.1% for urea, starch, and synthetic neutralisers) with over 98% concordance with spectrophotometric lab assays.',
  },
  {
    id: 'faq-duration',
    question: 'How long does a test take?',
    answer:
      'Most tests complete in 2 to 5 minutes. You simply add a small sample of milk, paneer, or warm ghee into the provided reaction vial, add the pre-measured reagent, wait 120 seconds, and observe the visible color shift.',
  },
  {
    id: 'faq-equipment',
    question: 'Do I need any special equipment?',
    answer:
      'No. Everything required comes inside the box — test tubes, graduated sample pipettes, dropper bottles with sealed reagents, and a pocket-sized waterproof interpretation chart. All you need is a clean kitchen counter and your food sample.',
  },
  {
    id: 'faq-adulterants',
    question: 'What adulterants can this detect?',
    answer:
      'The kits cover the most rampant dairy contaminants: urea, chemical detergents, neutralisers (baking soda and carbonates), formalin preservatives, starch binding agents, non-permitted azo dyes/artificial food colors, vanaspati (hydrogenated vegetable fat), and cheap mineral oils in desi ghee.',
  },
  {
    id: 'faq-multi-use-test-count',
    question: 'How many tests can I perform with each kit?',
    answer:
      'We offer two formats: our Single-Use kits are designed for a single test for immediate spot verification, while our Multi-Use kits contain enough reagents and testing vials to perform multiple separate tests (8 to 28 tests per kit depending on the product).',
  },
  {
    id: 'faq-difference-lab',
    question: 'How is this different from lab testing?',
    answer:
      'Commercial laboratories conduct quantitative gas chromatography or mass spectrometry, which can take 5 to 7 days and cost thousands of rupees per sample. Milawat Proof provides rapid qualitative screening at home within minutes, alerting you immediately before your family consumes adulterated food.',
  },
  {
    id: 'faq-shipping',
    question: 'Where do you ship, and how long does delivery take?',
    answer:
      'We ship Pan-India to all serviceable pin codes. Standard delivery charges apply at checkout based on your location. Orders in metro cities (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Pune) typically arrive within 2 to 4 business days; tier-2 and tier-3 towns take 4 to 6 business days.',
  },
  {
    id: 'faq-fssai-certified',
    question: 'Is this FSSAI approved / lab certified?',
    answer:
      'The reagents and colorimetric protocols employed in our kits are aligned with the Rapid Analytical Food Testing (RAFT) methodologies recognized in food safety guidelines. The formulation batches are manufactured in an ISO-certified facility and validated by independent third-party NABL-accredited testing laboratories.',
  },
];

export const FAQ: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-accuracy');

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="w-full bg-white py-16 sm:py-20 lg:py-24 border-b border-[#F5F4F0]"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1C9A6C] block mb-2">
            Clear Answers
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#141414] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-[#525252] leading-relaxed">
            Everything you need to know about at-home testing, accuracy, shelf life, and shipping.
          </p>
        </div>

        {/* Accordion Container */}
        <div
          id="faq-accordion"
          className="divide-y divide-[#ebe9e3] border-t border-b border-[#ebe9e3]"
        >
          {faqData.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                id={item.id}
                className={`transition-colors duration-150 ${
                  isOpen ? 'bg-[#F5F4F0]/40' : 'hover:bg-[#F5F4F0]/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="w-full py-5 sm:py-6 px-3 sm:px-4 flex items-center justify-between gap-4 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C9A6C] rounded"
                  aria-expanded={isOpen}
                  aria-controls={`${item.id}-answer`}
                >
                  <span
                    className={`text-base sm:text-lg font-bold transition-colors pr-2 ${
                      isOpen ? 'text-[#1C9A6C]' : 'text-[#141414]'
                    }`}
                  >
                    {item.question}
                  </span>

                  <span
                    className={`p-1.5 rounded-full shrink-0 transition-transform duration-200 border ${
                      isOpen
                        ? 'rotate-180 bg-[#1C9A6C] text-white border-[#1C9A6C]'
                        : 'rotate-0 bg-white text-[#717171] border-[#e5e4de]'
                    }`}
                    aria-hidden="true"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                {/* Collapsible Answer with smooth visual transition */}
                {isOpen && (
                  <div
                    id={`${item.id}-answer`}
                    className="px-3 sm:px-4 pb-6 pt-1 text-sm sm:text-base text-[#525252] leading-relaxed"
                  >
                    <p className="max-w-3xl">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Callout Footnote */}
        <div className="mt-12 p-6 rounded-lg bg-[#F5F4F0] border border-[#ebe9e3] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white border border-[#e5e4de] flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5 text-[#1C9A6C]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#141414]">
                Have a specific question about your milk or ghee brand?
              </p>
              <p className="text-xs text-[#717171] mt-0.5">
                Our food safety advisory team is available on WhatsApp and email.
              </p>
            </div>
          </div>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              const contactEl = document.getElementById('contact');
              if (contactEl) {
                contactEl.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-white border border-[#e5e4de] text-xs font-semibold text-[#141414] hover:text-[#1C9A6C] hover:border-[#1C9A6C] transition-colors whitespace-nowrap"
          >
            <span>Ask Us Directly</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
