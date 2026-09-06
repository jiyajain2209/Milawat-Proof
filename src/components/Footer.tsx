import React, { useState } from 'react';
import { Logo } from './Logo';
import { Mail, Phone, MapPin, Instagram, Twitter, Youtube, Linkedin, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate?: (navId: string) => void;
  onToast?: (msg: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onToast }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activePolicyModal, setActivePolicyModal] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) return;
    setSubscribed(true);
    if (onToast) {
      onToast('Subscribed! You will receive early updates on new kits.');
    }
  };

  const handleLinkClick = (e: React.MouseEvent, navId: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(navId);
    } else {
      const el = document.getElementById(navId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      id="main-footer"
      className="w-full bg-[#141414] text-white border-t border-[#262626] relative"
    >
      {/* Upper Footer: 4 Main Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Col 1: Small Logo Lockup & Brand Mission (Col 1-4) */}
          <div className="lg:col-span-4 space-y-4">
            <Logo size="sm" dark={true} showTagline={true} />
            <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed max-w-sm pt-2">
              Empowering Indian households with instant, clinical-grade testing kits to detect dairy adulteration right on their kitchen counter.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#1C9A6C] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Tested &amp; Calibrated for Indian Dairy Standards</span>
            </div>
          </div>

          {/* Col 2: Quick Links (Col 5-6) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#A3A3A3]">
              <li>
                <a
                  href="#shop"
                  onClick={(e) => handleLinkClick(e, 'shop')}
                  className="hover:text-[#1C9A6C] transition-colors"
                >
                  Shop Test Kits
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  onClick={(e) => handleLinkClick(e, 'how-it-works')}
                  className="hover:text-[#1C9A6C] transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#our-story"
                  onClick={(e) => handleLinkClick(e, 'our-story')}
                  className="hover:text-[#1C9A6C] transition-colors"
                >
                  Our Story
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  onClick={(e) => handleLinkClick(e, 'faq')}
                  className="hover:text-[#1C9A6C] transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleLinkClick(e, 'contact')}
                  className="hover:text-[#1C9A6C] transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/admin"
                  onClick={(e) => handleLinkClick(e, 'admin')}
                  className="hover:text-[#1C9A6C] transition-colors inline-flex items-center gap-1 text-[#737373]"
                >
                  <span>Admin Portal</span>
                  <span className="text-[10px] px-1 py-0.2 rounded bg-[#262626] text-[#A3A3A3]">Protected</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Details & Social Links (Col 7-9) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white">
              Contact
            </h4>
            
            <div className="space-y-3 text-xs sm:text-sm text-[#A3A3A3]">
              {/* Email */}
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#1C9A6C] shrink-0" />
                <a
                  href="mailto:milawatproof@gmail.com"
                  className="hover:text-white transition-colors truncate"
                >
                  milawatproof@gmail.com
                </a>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#1C9A6C] shrink-0" />
                <a
                  href="tel:+916359244987"
                  className="hover:text-white transition-colors"
                >
                  +91 6359244987
                </a>
              </div>

              {/* Business Address */}
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#1C9A6C] shrink-0 mt-0.5" />
                <div className="text-xs text-[#A3A3A3] leading-relaxed">
                  <span className="text-white font-medium block">Mesa School of Business, Arekere, Bengaluru</span>
                  WeWork, Bannerghatta Main Road, Arekere, Bengaluru, Karnataka 560076
                </div>
              </div>

              {/* Social Icons Row */}
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-[#737373] uppercase tracking-wider block mb-2">
                  Follow Our Mission
                </span>
                <div className="flex items-center gap-2.5">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-md bg-[#262626] flex items-center justify-center text-[#A3A3A3] hover:text-white hover:bg-[#1C9A6C] transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-md bg-[#262626] flex items-center justify-center text-[#A3A3A3] hover:text-white hover:bg-[#1C9A6C] transition-colors"
                    aria-label="Twitter / X"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-md bg-[#262626] flex items-center justify-center text-[#A3A3A3] hover:text-white hover:bg-[#1C9A6C] transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-md bg-[#262626] flex items-center justify-center text-[#A3A3A3] hover:text-white hover:bg-[#1C9A6C] transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Newsletter Signup (Col 10-12) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-white">
              Get updates on new test kits
            </h4>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              Subscribe for alerts when we release diagnostic tests for spices, edible oils, and raw honey.
            </p>

            {subscribed ? (
              <div className="p-3.5 rounded-md bg-[#1C9A6C]/15 border border-[#1C9A6C]/30 flex items-center gap-2 text-xs text-[#1C9A6C] font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>You&apos;re subscribed for new kit releases!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#262626] border border-[#404040] rounded-md text-white placeholder-[#737373] focus:outline-none focus:border-[#1C9A6C] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md bg-[#1C9A6C] hover:bg-[#167e58] text-white text-xs font-semibold tracking-wide transition-colors cursor-pointer"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#262626] bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#737373]">
          <div>
            &copy; 2026 Milawat Proof. Made in India.
          </div>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => setActivePolicyModal('privacy')}
              className="hover:text-[#A3A3A3] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-[#404040]">&bull;</span>
            <button
              type="button"
              onClick={() => setActivePolicyModal('terms')}
              className="hover:text-[#A3A3A3] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <span className="text-[#404040]">&bull;</span>
            <button
              type="button"
              onClick={() => setActivePolicyModal('shipping')}
              className="hover:text-[#A3A3A3] transition-colors cursor-pointer"
            >
              Shipping Policy
            </button>
          </div>
        </div>
      </div>

      {/* Policy Modal */}
      {activePolicyModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setActivePolicyModal(null)}
        >
          <div
            className="bg-white text-[#141414] rounded-xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#F5F4F0] pb-3">
              <h3 className="text-lg font-bold">
                {activePolicyModal === 'privacy' && 'Privacy Policy'}
                {activePolicyModal === 'terms' && 'Terms of Service'}
                {activePolicyModal === 'shipping' && 'Shipping & Fulfillment Policy'}
              </h3>
              <button
                type="button"
                onClick={() => setActivePolicyModal(null)}
                className="text-neutral-400 hover:text-black text-sm font-semibold"
              >
                Close
              </button>
            </div>

            <div className="text-xs text-[#525252] space-y-2.5 leading-relaxed max-h-72 overflow-y-auto pr-2">
              {activePolicyModal === 'privacy' && (
                <>
                  <p>
                    Milawat Proof respects consumer privacy. We only collect shipping addresses and contact details strictly to fulfill your testing kit orders.
                  </p>
                  <p>
                    We never sell, distribute, or share customer data with food brands or third-party advertisers. For inquiries, email milawatproof@gmail.com.
                  </p>
                </>
              )}
              {activePolicyModal === 'terms' && (
                <>
                  <p>
                    Milawat Proof test kits are designed for qualitative at-home screening of common dairy adulterants and do not constitute certified legal testimony in court proceedings.
                  </p>
                  <p>
                    Store reagents in a cool, dry place away from direct sunlight. Follow included safety directions for responsible disposal.
                  </p>
                </>
              )}
              {activePolicyModal === 'shipping' && (
                <>
                  <p>
                    We ship Pan-India through temperature-controlled courier partners. Orders are dispatched from New Delhi within 24 hours of confirmation.
                  </p>
                  <p>
                    Metro deliveries arrive in 2-4 business days. Standard shipping charges apply at checkout. Tracking information is provided via SMS and email.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
