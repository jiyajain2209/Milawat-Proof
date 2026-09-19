import React, { useState } from 'react';
import { ContactMessage } from '../../types';
import { updateMessageStatus } from '../../services/adminMessageService';
import {
  X,
  Mail,
  Phone,
  Calendar,
  Clock,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  Image as ImageIcon,
  Tag,
  Maximize2,
} from 'lucide-react';

interface MessageDetailModalProps {
  message: ContactMessage | null;
  onClose: () => void;
}

export const MessageDetailModal: React.FC<MessageDetailModalProps> = ({
  message,
  onClose,
}) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showFullImageModal, setShowFullImageModal] = useState(false);

  if (!message) return null;

  const formattedDate = message.createdAt
    ? new Date(message.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Unknown Date';

  const handleStatusChange = async (newStatus: string) => {
    if (!message.id) return;
    try {
      setIsUpdatingStatus(true);
      await updateMessageStatus(message.id, newStatus);
    } catch (err) {
      console.error('Failed to update message status:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const cleanPhone = message.phone?.replace(/[^0-9+]/g, '');

  return (
    <>
      <div
        id="message-detail-modal-backdrop"
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        onClick={onClose}
      >
        <div
          id="message-detail-modal-content"
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E5E4DE] overflow-hidden my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E5E4DE] flex items-center justify-between bg-[#FAFAF8]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1C9A6C]/10 text-[#1C9A6C] flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-[#141414]">
                    Message from {message.name}
                  </h3>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      message.status === 'New'
                        ? 'bg-emerald-100 text-emerald-800'
                        : message.status === 'Replied'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {message.status || 'New'}
                  </span>
                </div>
                <p className="text-xs text-[#717171] flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-[#A3A3A3]" />
                  <span>{formattedDate}</span>
                </p>
              </div>
            </div>

            <button
              id="close-message-modal-btn"
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-[#EAE8E3] text-[#717171] hover:text-[#141414] flex items-center justify-center transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6 max-h-[calc(85vh-130px)] overflow-y-auto text-xs sm:text-sm">
            {/* Sender Info Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[#FAFAF8] rounded-xl border border-[#E5E4DE]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#717171] block mb-1">
                  Sender Contact
                </span>
                <p className="font-semibold text-sm text-[#141414]">{message.name}</p>
                <a
                  href={`mailto:${message.email}`}
                  className="inline-flex items-center gap-1.5 text-xs text-[#1C9A6C] hover:underline mt-1 font-medium"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{message.email}</span>
                </a>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#717171] block mb-1">
                  Phone / WhatsApp
                </span>
                {cleanPhone ? (
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-[#141414] flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#717171]" />
                      <span>{message.phone}</span>
                    </p>
                    <a
                      href={`https://wa.me/${cleanPhone.replace('+', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-[#1C9A6C] hover:underline"
                    >
                      <span>Chat on WhatsApp</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-[#A3A3A3] italic">No phone number provided</p>
                )}
              </div>
            </div>

            {/* Message Content */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#717171] block">
                Message Content
              </span>
              <div className="p-4 rounded-xl bg-white border border-[#E5E4DE] text-[#141414] text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-normal shadow-2xs">
                {message.message}
              </div>
            </div>

            {/* Attached Image Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#717171] flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#1C9A6C]" />
                  <span>Attached Photo / Strip Image</span>
                </span>
                {message.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setShowFullImageModal(true)}
                    className="text-xs text-[#1C9A6C] hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>View Full Size</span>
                  </button>
                )}
              </div>

              {message.imageUrl ? (
                <div className="relative group rounded-xl border border-[#E5E4DE] bg-[#FAFAF8] p-3 text-center overflow-hidden">
                  <img
                    src={message.imageUrl}
                    alt="Customer attachment"
                    className="max-h-72 w-auto mx-auto rounded-lg object-contain cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={() => setShowFullImageModal(true)}
                  />
                  <div className="mt-2 text-[11px] text-[#717171] flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1C9A6C]" />
                    <span>Customer attachment loaded securely</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-[#D5D4CE] bg-[#FAFAF8] text-center text-xs text-[#717171]">
                  No photo was attached with this message.
                </div>
              )}
            </div>

            {/* Status & Review Controls */}
            <div className="p-4 bg-[#FAFAF8] rounded-xl border border-[#E5E4DE] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#717171]" />
                <span className="text-xs font-semibold text-[#525252]">Mark Status:</span>
              </div>

              <div className="flex items-center gap-1.5">
                {(['New', 'Read', 'Replied'] as const).map((statusOption) => (
                  <button
                    key={statusOption}
                    type="button"
                    disabled={isUpdatingStatus}
                    onClick={() => handleStatusChange(statusOption)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      message.status === statusOption
                        ? 'bg-[#141414] text-white shadow-xs'
                        : 'bg-white hover:bg-[#EAE8E3] text-[#525252] border border-[#D5D4CE]'
                    }`}
                  >
                    {statusOption}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-[#E5E4DE] bg-[#FAFAF8] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <a
                href={`mailto:${message.email}?subject=Re: MilawatProof Inquiry from ${encodeURIComponent(
                  message.name
                )}&body=Hi ${encodeURIComponent(
                  message.name
                )},%0D%0A%0D%0AThank you for reaching out to MilawatProof regarding your inquiry:%0D%0A"${encodeURIComponent(
                  message.message.substring(0, 150)
                )}..."%0D%0A%0D%0A`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1C9A6C] hover:bg-[#167e58] text-white text-xs font-semibold transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Reply via Email</span>
              </a>

              {cleanPhone && (
                <a
                  href={`https://wa.me/${cleanPhone.replace('+', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#D5D4CE] bg-white hover:bg-[#F5F4F0] text-xs font-semibold text-[#141414] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#1C9A6C]" />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#D5D4CE] bg-white hover:bg-[#F5F4F0] text-xs font-semibold text-[#525252] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Full Image Lightbox */}
      {showFullImageModal && message.imageUrl && (
        <div
          className="fixed inset-0 z-60 bg-black/90 flex flex-col items-center justify-center p-4"
          onClick={() => setShowFullImageModal(false)}
        >
          <div className="max-w-4xl max-h-[90vh] relative">
            <button
              type="button"
              onClick={() => setShowFullImageModal(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-sm font-semibold flex items-center gap-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
              <span>Close preview</span>
            </button>
            <img
              src={message.imageUrl}
              alt="Full size attachment"
              className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};
