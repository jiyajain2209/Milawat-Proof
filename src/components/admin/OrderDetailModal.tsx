import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { updateOrderStatus } from '../../services/adminOrderService';
import {
  X,
  Package,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Save,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
  onOrderUpdated?: (orderId: string, status: OrderStatus, notes: string) => void;
}

const STATUS_OPTIONS: OrderStatus[] = ['Pending', 'Confirmed', 'Fulfilled', 'Cancelled'];

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onOrderUpdated,
}) => {
  if (!order) return null;

  const [status, setStatus] = useState<OrderStatus>(order.orderStatus);
  const [notes, setNotes] = useState<string>(order.notes || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async () => {
    if (!order.id) {
      setErrorMsg('Cannot update order: missing document identifier.');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);
    setSaveSuccess(false);

    try {
      await updateOrderStatus(order.id, status, notes);
      setSaveSuccess(true);
      if (onOrderUpdated) {
        onOrderUpdated(order.id, status, notes);
      }
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Failed to update order in Firestore:', err);
      setErrorMsg(err.message || 'Failed to update order status. Please check your admin privileges.');
    } finally {
      setIsSaving(false);
    }
  };

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Unknown Date';

  // Sanitize phone for WhatsApp link
  const cleanPhoneDigits = order.phone ? order.phone.replace(/\D/g, '') : '';
  const waPhone = cleanPhoneDigits.length === 10 ? `91${cleanPhoneDigits}` : cleanPhoneDigits;

  return (
    <div
      id="admin-order-detail-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="admin-order-detail-card"
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-[#E5E4DE] overflow-hidden my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#F0EFEB] flex items-center justify-between bg-[#FAFAF8]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#141414] px-2 py-0.5 rounded bg-[#EAE8E3]">
                {order.orderId}
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  order.orderStatus === 'Pending'
                    ? 'bg-amber-100 text-amber-800'
                    : order.orderStatus === 'Confirmed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : order.orderStatus === 'Fulfilled'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-zinc-200 text-zinc-700'
                }`}
              >
                {order.orderStatus}
              </span>
            </div>
            <p className="text-xs text-[#717171] mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Ordered on {formattedDate}
            </p>
          </div>

          <button
            id="close-order-detail-btn"
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#717171] hover:text-[#141414] hover:bg-[#EAE8E3] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Status & Quick Action Updater Card */}
          <div className="p-4 rounded-xl bg-[#F9F8F5] border border-[#E5E4DE] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label
                  htmlFor="admin-status-select"
                  className="block text-xs font-bold uppercase tracking-wider text-[#141414] mb-1"
                >
                  Manage Order Status
                </label>
                <p className="text-xs text-[#717171]">
                  Update to keep internal batch fulfillment in sync.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  id="admin-status-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as OrderStatus)}
                  className="px-3 py-2 rounded-lg border border-[#D5D4CE] bg-white font-semibold text-sm text-[#141414] focus:border-[#1C9A6C] focus:ring-1 focus:ring-[#1C9A6C] outline-hidden cursor-pointer"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>

                <button
                  id="admin-save-status-btn"
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1C9A6C] hover:bg-[#167e58] disabled:opacity-60 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs shrink-0"
                >
                  {isSaving ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>Save</span>
                </button>
              </div>
            </div>

            {saveSuccess && (
              <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Status &amp; notes updated in Firestore database.</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-2 rounded bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Customer & Delivery Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-[#E5E4DE] bg-white space-y-2.5">
              <span className="text-xs font-bold text-[#141414] uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#1C9A6C]" /> Customer Details
              </span>
              <div className="text-xs space-y-1.5 text-[#525252]">
                <p className="font-semibold text-sm text-[#141414]">{order.customerName}</p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#717171]" />
                  <span className="font-mono">{order.phone}</span>
                  {order.phone && (
                    <a
                      href={`https://wa.me/${waPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1C9A6C] hover:underline"
                    >
                      <MessageSquare className="w-3 h-3" /> WhatsApp
                    </a>
                  )}
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#717171]" />
                  <a href={`mailto:${order.email}`} className="hover:underline">
                    {order.email}
                  </a>
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[#E5E4DE] bg-white space-y-2.5">
              <span className="text-xs font-bold text-[#141414] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#1C9A6C]" /> Delivery Destination
              </span>
              <div className="text-xs text-[#525252] leading-relaxed">
                <p className="whitespace-pre-wrap">{order.deliveryAddress}</p>
              </div>
            </div>
          </div>

          {/* Items Ordered Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#141414] uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#1C9A6C]" /> Ordered Items ({order.items.length})
              </span>
              <span className="text-xs text-[#717171]">
                Total: <strong className="text-[#141414] text-sm">₹{order.orderTotal}</strong>
              </span>
            </div>

            <div className="border border-[#E5E4DE] rounded-xl overflow-hidden bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAFAF8] border-b border-[#E5E4DE] text-[#717171] font-semibold">
                    <th className="py-2.5 px-3">Product Name</th>
                    <th className="py-2.5 px-3">Tier</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Price</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EFEB]">
                  {order.items.map((item, index) => (
                    <tr key={index} className="hover:bg-[#FDFDFD]">
                      <td className="py-2.5 px-3 font-semibold text-[#141414]">
                        {item.productName}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="capitalize px-2 py-0.5 rounded bg-[#F5F4F0] text-[11px] font-medium text-[#525252]">
                          {item.tier}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-[#141414]">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 px-3 text-right text-[#525252]">
                        ₹{item.pricePerItem}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#141414]">
                        ₹{item.pricePerItem * item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[#FAFAF8] border-t border-[#E5E4DE] font-bold text-xs">
                    <td colSpan={4} className="py-2.5 px-3 text-right text-[#141414]">
                      Pre-Order Total Amount:
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#1C9A6C] text-sm">
                      ₹{order.orderTotal}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Admin Notes Section */}
          <div className="space-y-2">
            <label
              htmlFor="admin-notes-textarea"
              className="block text-xs font-bold text-[#141414] uppercase tracking-wider"
            >
              Internal Admin &amp; Fulfillment Notes
            </label>
            <textarea
              id="admin-notes-textarea"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Spoke to customer on WhatsApp, batch allocating next Tuesday, courier tracking airway bill..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#D5D4CE] focus:border-[#1C9A6C] focus:ring-1 focus:ring-[#1C9A6C] text-xs text-[#141414] placeholder:text-[#A3A3A3] outline-hidden resize-none transition-colors"
            />
            <p className="text-[11px] text-[#717171]">
              Notes are only visible to authenticated admins and saved directly into Firestore.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-[#F0EFEB] bg-[#FAFAF8] flex justify-between items-center">
          <span className="text-[11px] text-[#717171]">
            Document ID: <code className="font-mono text-[10px] text-[#525252]">{order.id}</code>
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#D5D4CE] bg-white text-xs font-bold text-[#525252] hover:text-[#141414] hover:bg-[#F5F4F0] transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 rounded-lg bg-[#1C9A6C] hover:bg-[#167e58] disabled:opacity-60 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
