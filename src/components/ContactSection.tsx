import React, { useState } from 'react';
import { Mail, Phone, Send, CheckCircle2, MessageSquare, Clock, MapPin } from 'lucide-react';

interface ContactSectionProps {
  onSuccessToast?: (msg: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onSuccessToast }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    // Simulate swift submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onSuccessToast) {
        onSuccessToast('Message sent! Our team will respond to your email.');
      }
    }, 600);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setIsSubmitted(false);
  };

  return (
    <section
      id="contact"
      className="w-full bg-[#FAFAF8] py-16 sm:py-20 lg:py-24 border-b border-[#E5E4DE]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1C9A6C] block mb-2">
            Direct Support
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#141414] tracking-tight">
            Contact Milawat Proof
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#525252] leading-relaxed">
            Have questions about testing your dairy, bulk orders for residential societies, or interpreting test strip results? We&apos;re here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Direct Info & Assistance */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E5E4DE] space-y-6">
              <h3 className="text-xl font-bold text-[#141414]">
                Reach Out Directly
              </h3>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#1C9A6C]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-5 h-5 text-[#1C9A6C]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#717171] uppercase tracking-wider block">
                    Email Inquiries
                  </span>
                  <a
                    href="mailto:milawatproof@gmail.com"
                    className="text-base font-bold text-[#141414] hover:text-[#1C9A6C] transition-colors"
                  >
                    milawatproof@gmail.com
                  </a>
                  <p className="text-xs text-[#717171] mt-0.5">
                    For consumer help, partnerships, and lab reports
                  </p>
                </div>
              </div>

              {/* Phone / WhatsApp */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#1C9A6C]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-5 h-5 text-[#1C9A6C]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#717171] uppercase tracking-wider block">
                    Phone &amp; WhatsApp
                  </span>
                  <a
                    href="tel:9717655516"
                    className="text-base font-bold text-[#141414] hover:text-[#1C9A6C] transition-colors"
                  >
                    +91 97176 55516
                  </a>
                  <p className="text-xs text-[#717171] mt-0.5">
                    Mon–Sat, 9:30 AM to 7:00 PM IST
                  </p>
                </div>
              </div>

              {/* Response Time Indicator */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#F5F4F0] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-5 h-5 text-[#525252]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#717171] uppercase tracking-wider block">
                    Response Window
                  </span>
                  <p className="text-sm font-semibold text-[#141414]">
                    Replies within 2 to 4 business hours
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#1C9A6C]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-[#1C9A6C]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#717171] uppercase tracking-wider block">
                    Business Address
                  </span>
                  <p className="text-sm font-bold text-[#141414]">
                    Mesa School of Business, Arekere, Bengaluru
                  </p>
                  <p className="text-xs text-[#525252] mt-0.5 leading-relaxed">
                    WeWork, Bannerghatta Main Road, Arekere, Bengaluru, Karnataka 560076, India
                  </p>
                </div>
              </div>
            </div>

            {/* Verification Note */}
            <div className="p-4 rounded-lg bg-[#1C9A6C]/8 border border-[#1C9A6C]/25 text-xs text-[#525252] leading-relaxed">
              <span className="font-semibold text-[#141414] block mb-1">
                Got an ambiguous test strip color?
              </span>
              Take a clear photograph of your reaction tube next to our color guide and WhatsApp it to <strong>+91 97176 55516</strong> for instant expert verification.
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-10 rounded-xl border border-[#E5E4DE] shadow-xs">
              {isSubmitted ? (
                <div
                  id="contact-success-state"
                  className="py-12 text-center flex flex-col items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#1C9A6C]/15 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-[#1C9A6C]" />
                  </div>
                  <h4 className="text-2xl font-bold text-[#141414]">
                    Thank You, {name}!
                  </h4>
                  <p className="text-sm text-[#525252] mt-2 max-w-md mx-auto leading-relaxed">
                    Your inquiry has been routed to <strong>milawatproof@gmail.com</strong>. A dairy safety advisor will get in touch with you shortly at <strong>{email}</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-6 inline-flex items-center justify-center px-5 py-2.5 rounded-md border border-[#E5E4DE] text-xs font-semibold text-[#141414] hover:bg-[#F5F4F0] transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form id="contact-form" onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-[#F5F4F0] pb-4 mb-2">
                    <h3 className="text-xl font-bold text-[#141414]">
                      Send us a Message
                    </h3>
                    <p className="text-xs text-[#717171] mt-1">
                      Fill out the form below and we will get back to you today.
                    </p>
                  </div>

                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5"
                    >
                      Your Name <span className="text-[#D6432E]">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ananya Sharma"
                      className="w-full px-4 py-2.5 text-sm bg-[#FAFAF8] border border-[#E5E4DE] rounded-md text-[#141414] placeholder-[#A3A3A3] focus:outline-none focus:border-[#1C9A6C] focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5"
                      >
                        Email Address <span className="text-[#D6432E]">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ananya@example.com"
                        className="w-full px-4 py-2.5 text-sm bg-[#FAFAF8] border border-[#E5E4DE] rounded-md text-[#141414] placeholder-[#A3A3A3] focus:outline-none focus:border-[#1C9A6C] focus:bg-white transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5"
                      >
                        Phone Number (Optional)
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-2.5 text-sm bg-[#FAFAF8] border border-[#E5E4DE] rounded-md text-[#141414] placeholder-[#A3A3A3] focus:outline-none focus:border-[#1C9A6C] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1.5"
                    >
                      Message <span className="text-[#D6432E]">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us what dairy product you are testing, any queries about our test kits, or order requests..."
                      className="w-full px-4 py-2.5 text-sm bg-[#FAFAF8] border border-[#E5E4DE] rounded-md text-[#141414] placeholder-[#A3A3A3] focus:outline-none focus:border-[#1C9A6C] focus:bg-white transition-colors resize-y"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      id="contact-submit-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-md bg-[#1C9A6C] hover:bg-[#167e58] text-white text-sm font-semibold tracking-wide transition-colors cursor-pointer shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C9A6C] disabled:opacity-70"
                    >
                      <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
