import React, { useState, useRef, useEffect } from 'react';
import {
  Mail,
  Phone,
  Send,
  CheckCircle2,
  Clock,
  MapPin,
  Camera,
  X,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { submitContactMessage } from '../services/contactService';

interface ContactSectionProps {
  onSuccessToast?: (msg: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onSuccessToast }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Revoke object URL on unmount or when image changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (file: File | undefined) => {
    if (!file) return;
    setFileError(null);

    // Accept image types (JPG, PNG, HEIC, WebP)
    const isValidType =
      file.type.startsWith('image/') ||
      /\.(jpe?g|png|heic|webp)$/i.test(file.name);

    if (!isValidType) {
      setFileError('Please select a valid image file (JPG, PNG, or HEIC).');
      return;
    }

    // 5MB limit
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setFileError(`Image file size must be under 5MB (selected file is ${sizeMb}MB).`);
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setImageFile(null);
    setPreviewUrl(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      await submitContactMessage({
        name,
        email,
        phone,
        message,
        imageFile,
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onSuccessToast) {
        onSuccessToast("Thanks, we've received your message and will get back to you within 2 to 4 business hours");
      }
    } catch (err) {
      console.error('Error submitting contact message:', err);
      setSubmissionError(
        err instanceof Error
          ? err.message
          : 'Failed to send message. Please check your details or try again.'
      );
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    handleRemovePhoto();
    setSubmissionError(null);
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
                    href="tel:+916359244987"
                    className="text-base font-bold text-[#141414] hover:text-[#1C9A6C] transition-colors"
                  >
                    +91 6359244987
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
              Take a clear photograph of your reaction tube next to our color guide and attach it in the form or WhatsApp it to <strong>+91 6359244987</strong> for instant expert verification.
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-10 rounded-xl border border-[#E5E4DE] shadow-xs">
              {isSubmitted ? (
                <div
                  id="contact-success-state"
                  className="py-10 text-center flex flex-col items-center justify-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-[#1C9A6C]/15 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-[#1C9A6C]" />
                  </div>
                  <div className="space-y-2 max-w-md mx-auto">
                    <h4 className="text-2xl font-bold text-[#141414]">
                      Message Received!
                    </h4>
                    <p className="text-sm text-[#1C9A6C] font-semibold bg-[#1C9A6C]/10 py-2.5 px-4 rounded-lg">
                      Thanks, we&apos;ve received your message and will get back to you within 2 to 4 business hours.
                    </p>
                    <p className="text-xs text-[#525252] leading-relaxed pt-1">
                      Our dairy safety specialists have received your inquiry from <strong>{name}</strong> and will follow up directly at <strong>{email}</strong>{phone ? ` or ${phone}` : ''}.
                    </p>
                  </div>
                  {previewUrl && (
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1C9A6C]/10 text-[#1C9A6C] text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Photo attachment saved with your message</span>
                    </div>
                  )}
                  <button
                    id="contact-send-another-btn"
                    type="button"
                    onClick={handleReset}
                    className="mt-4 inline-flex items-center justify-center px-6 py-2.5 rounded-md border border-[#E5E4DE] text-xs font-semibold text-[#141414] hover:bg-[#F5F4F0] transition-colors cursor-pointer"
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

                  {/* Submission Error Banner */}
                  {submissionError && (
                    <div
                      id="contact-submission-error-top"
                      className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2.5"
                    >
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Submission Failed</p>
                        <p>{submissionError}</p>
                      </div>
                    </div>
                  )}

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

                  {/* Photo Attachment (Optional) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="contact-photo"
                        className="block text-xs font-bold uppercase tracking-wider text-[#141414]"
                      >
                        Attach a photo (optional)
                      </label>
                      <span className="text-[11px] text-[#717171]">
                        JPG, PNG, HEIC up to 5MB
                      </span>
                    </div>

                    {/* Hidden native input */}
                    <input
                      ref={fileInputRef}
                      id="contact-photo"
                      type="file"
                      accept="image/jpeg,image/png,image/heic,image/webp,.jpg,.jpeg,.png,.heic"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileSelect(e.target.files[0]);
                        }
                      }}
                    />

                    {previewUrl && imageFile ? (
                      /* Selected Image Preview Box */
                      <div className="flex items-center justify-between gap-3 p-3 bg-[#FAFAF8] border border-[#E5E4DE] rounded-md transition-all">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-14 h-14 rounded-md overflow-hidden border border-[#E5E4DE] bg-white shrink-0">
                            <img
                              src={previewUrl}
                              alt="Upload preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#141414] truncate max-w-[180px] sm:max-w-xs">
                              {imageFile.name}
                            </p>
                            <p className="text-[11px] text-[#717171] mt-0.5">
                              {formatFileSize(imageFile.size)} &bull; Attached
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-2.5 py-1.5 text-xs font-semibold text-[#525252] hover:text-[#141414] bg-white hover:bg-[#F5F4F0] border border-[#E5E4DE] rounded transition-colors cursor-pointer"
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="p-1.5 text-[#717171] hover:text-[#D6432E] bg-white hover:bg-red-50 border border-[#E5E4DE] hover:border-red-200 rounded transition-colors cursor-pointer"
                            title="Remove photo"
                            aria-label="Remove photo"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Upload Button / Dropzone */
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full px-4 py-4 rounded-md border border-dashed text-center transition-colors cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                          isDragging
                            ? 'border-[#1C9A6C] bg-[#1C9A6C]/5'
                            : 'border-[#E5E4DE] bg-[#FAFAF8] hover:border-[#1C9A6C]/60 hover:bg-[#F5F4F0]/70'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-[#1C9A6C]/10 text-[#1C9A6C] flex items-center justify-center">
                          <Camera className="w-4 h-4" />
                        </div>
                        <p className="text-xs text-[#141414]">
                          <span className="font-bold text-[#1C9A6C]">Click to attach photo</span> or drag &amp; drop
                        </p>
                        <p className="text-[11px] text-[#717171]">
                          Test strip reaction, milk carton, or sample photo
                        </p>
                      </div>
                    )}

                    {/* File validation error */}
                    {fileError && (
                      <p className="text-xs text-[#D6432E] mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{fileError}</span>
                      </p>
                    )}
                  </div>

                  {/* Submission Error Alert */}
                  {submissionError && (
                    <div className="p-3 rounded-md bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{submissionError}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      id="contact-submit-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-md bg-[#1C9A6C] hover:bg-[#167e58] text-white text-sm font-semibold tracking-wide transition-colors cursor-pointer shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C9A6C] disabled:opacity-70"
                    >
                      {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      <span>
                        {isSubmitting
                          ? imageFile
                            ? 'Uploading photo & sending...'
                            : 'Sending...'
                          : 'Send Message'}
                      </span>
                      {!isSubmitting && <Send className="w-4 h-4" />}
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
