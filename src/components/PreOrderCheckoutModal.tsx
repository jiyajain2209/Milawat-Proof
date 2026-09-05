import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import { createPreOrder } from '../services/orderService';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
  Clock,
  Package,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface PreOrderCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: (order: Order) => void;
}

export const PreOrderCheckoutModal: React.FC<PreOrderCheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  if (!isOpen) return null;

  const totalAmount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalKitsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Form Validations
    if (!customerName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const cleanPhone = phone.trim().replace(/[\s-]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please provide a valid 10-digit mobile contact number.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Please provide a valid email address for order notifications.');
      return;
    }

    if (!addressLine.trim() || !city.trim() || !pincode.trim()) {
      setErrorMsg('Please fill in complete delivery address details (street, city, pincode).');
      return;
    }

    const cleanPincode = pincode.trim().replace(/\D/g, '');
    if (cleanPincode.length !== 6) {
      setErrorMsg('Please provide a valid 6-digit Indian PIN code.');
      return;
    }

    const fullDeliveryAddress = `${addressLine.trim()}, ${city.trim()}${stateName.trim() ? `, ${stateName.trim()}` : ''} - ${cleanPincode}, India`;

    setIsSubmitting(true);

    try {
      const order = await createPreOrder({
        customerName,
        phone: cleanPhone,
        email,
        deliveryAddress: fullDeliveryAddress,
        items,
      });

      setConfirmedOrder(order);
      onOrderSuccess(order);
    } catch (err: unknown) {
      console.error('Failed to submit pre-order:', err);
      setErrorMsg('Failed to record pre-order in our system. Please check your network and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyOrderId = () => {
    if (!confirmedOrder) return;
    navigator.clipboard.writeText(confirmedOrder.orderId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  const handleCloseAndReset = () => {
    setConfirmedOrder(null);
    setErrorMsg(null);
    onClose();
  };

  return (
    <div
      id="pre-order-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#141414]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={handleCloseAndReset}
    >
      <div
        id="pre-order-modal-container"
        className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-[#E5E4DE] overflow-hidden my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#F5F4F0] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1C9A6C]/10 flex items-center justify-center">
              <Package className="w-4 h-4 text-[#1C9A6C]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#141414]">
                {confirmedOrder ? 'Pre-Order Confirmation' : 'Complete Your Pre-Order'}
              </h3>
              <p className="text-xs text-[#717171]">
                {confirmedOrder
                  ? 'Your reservation is registered in our laboratory queue'
                  : 'Pay ₹0 today — manual verification prior to dispatch'}
              </p>
            </div>
          </div>

          <button
            id="close-preorder-modal-btn"
            type="button"
            onClick={handleCloseAndReset}
            className="p-1.5 rounded text-[#717171] hover:text-[#141414] hover:bg-[#F5F4F0] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Either Confirmed Success State or Checkout Form */}
        {confirmedOrder ? (
          /* SUCCESS CONFIRMATION STATE */
          <div id="pre-order-success-view" className="p-5 sm:p-6 space-y-6">
            <div className="text-center py-2">
              <div className="w-14 h-14 bg-[#1C9A6C]/10 text-[#1C9A6C] rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1C9A6C]/15 text-[#1C9A6C] mb-2">
                <Sparkles className="w-3 h-3" /> Pre-Order Registered
              </span>
              <h4 className="text-xl font-bold text-[#141414]">
                Thank You, {confirmedOrder.customerName}!
              </h4>
              <p className="text-xs text-[#525252] max-w-md mx-auto mt-1 leading-relaxed">
                Your pre-order has been logged in our Firestore database. Because this is an authentic batch diagnostic test kit, our lab team verifies stock allocation and manually confirms every order before dispatch.
              </p>
            </div>

            {/* Order Reference Box */}
            <div className="p-4 rounded-lg bg-[#FAFAF8] border border-[#E5E4DE] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-[#717171] uppercase tracking-wider block">
                    Order ID Reference
                  </span>
                  <p className="text-base font-mono font-bold text-[#141414]">
                    {confirmedOrder.orderId}
                  </p>
                </div>
                <button
                  id="copy-order-id-btn"
                  type="button"
                  onClick={handleCopyOrderId}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-[#D5D4CE] hover:border-[#1C9A6C] text-xs font-semibold text-[#141414] transition-colors cursor-pointer shadow-2xs"
                  aria-label="Copy Order ID"
                >
                  {copiedId ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#1C9A6C]" />
                      <span className="text-[#1C9A6C]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#717171]" />
                      <span>Copy ID</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#E5E4DE] text-xs">
                <div>
                  <span className="text-[#717171] block">Order Status:</span>
                  <span className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 border border-amber-200 text-amber-800">
                    <Clock className="w-3 h-3 text-amber-600" />
                    {confirmedOrder.orderStatus} (Pending Confirmation)
                  </span>
                </div>
                <div>
                  <span className="text-[#717171] block">Order Total:</span>
                  <span className="font-bold text-sm text-[#141414]">
                    ₹{confirmedOrder.orderTotal}
                  </span>
                </div>
              </div>
            </div>

            {/* Pre-Order Items List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#141414] uppercase tracking-wider block">
                Pre-Ordered Diagnostic Kits ({confirmedOrder.items.length})
              </span>
              <div className="max-h-36 overflow-y-auto divide-y divide-[#F5F4F0] border border-[#E5E4DE] rounded-lg p-2 bg-white">
                {confirmedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2 first:pt-1 last:pb-1 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-[#141414]">{item.productName}</p>
                      <span className="text-[11px] text-[#717171] capitalize">
                        Tier: {item.tier} &bull; Qty: {item.quantity}
                      </span>
                    </div>
                    <span className="font-bold text-[#141414]">
                      ₹{item.pricePerItem * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Details */}
            <div className="p-3 bg-[#F5F4F0]/60 rounded-lg text-xs space-y-1">
              <span className="font-semibold text-[#141414] block">Delivery &amp; Contact:</span>
              <p className="text-[#525252]">{confirmedOrder.deliveryAddress}</p>
              <p className="text-[#717171] text-[11px]">
                Phone: {confirmedOrder.phone} &bull; Email: {confirmedOrder.email}
              </p>
            </div>

            {/* Verification Process Notice */}
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#1C9A6C]/5 border border-[#1C9A6C]/20 text-xs text-[#1C9A6C]">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-[#141414] leading-relaxed">
                <strong>Next Step:</strong> You will receive a WhatsApp/SMS confirmation within 24 hours. Our team will verify dispatch logistics before finalizing your order.
              </p>
            </div>

            <button
              id="finish-preorder-btn"
              type="button"
              onClick={handleCloseAndReset}
              className="w-full py-3 px-4 rounded-md bg-[#1C9A6C] hover:bg-[#167e58] text-white text-sm font-bold tracking-wide transition-colors cursor-pointer"
            >
              Done &bull; Continue Exploring
            </button>
          </div>
        ) : (
          /* PRE-ORDER SUBMISSION FORM */
          <form id="pre-order-form" onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
            {/* Order Items Preview Banner */}
            <div className="p-3.5 rounded-lg bg-[#FAFAF8] border border-[#E5E4DE] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#141414] uppercase tracking-wider">
                  Order Summary ({totalKitsCount} {totalKitsCount === 1 ? 'kit' : 'kits'})
                </span>
                <span className="font-black text-sm text-[#141414]">
                  Total: ₹{totalAmount}
                </span>
              </div>
              <div className="text-xs text-[#525252] max-h-24 overflow-y-auto space-y-1 pr-1">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center py-0.5">
                    <span className="truncate max-w-[280px]">
                      {item.product.name} ({item.product.tier === 'multi' ? 'Multi-Use' : 'Single-Use'}) &times; {item.quantity}
                    </span>
                    <span className="font-semibold shrink-0">
                      ₹{item.product.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notice regarding Pre-order model */}
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#1C9A6C]/8 border border-[#1C9A6C]/20 text-xs text-[#141414]">
              <ShieldCheck className="w-4 h-4 text-[#1C9A6C] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Pre-Order Policy:</strong> Orders are registered as <strong>Pending</strong> in our database. You will not be charged now. Our lab team will verify reagent batch availability and contact you prior to delivery.
              </p>
            </div>

            {errorMsg && (
              <div
                id="pre-order-error-message"
                className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Inputs */}
            <div className="space-y-3.5">
              <div>
                <label
                  htmlFor="preorder-name"
                  className="block text-xs font-bold text-[#141414] uppercase tracking-wider mb-1"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="preorder-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Priyanshu Sharma"
                  className="w-full px-3.5 py-2.5 rounded-md border border-[#D5D4CE] focus:border-[#1C9A6C] focus:ring-1 focus:ring-[#1C9A6C] text-sm text-[#141414] placeholder:text-[#A3A3A3] outline-hidden transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="preorder-phone"
                    className="block text-xs font-bold text-[#141414] uppercase tracking-wider mb-1"
                  >
                    Mobile Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="preorder-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 rounded-md border border-[#D5D4CE] focus:border-[#1C9A6C] focus:ring-1 focus:ring-[#1C9A6C] text-sm text-[#141414] placeholder:text-[#A3A3A3] outline-hidden transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="preorder-email"
                    className="block text-xs font-bold text-[#141414] uppercase tracking-wider mb-1"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="preorder-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-md border border-[#D5D4CE] focus:border-[#1C9A6C] focus:ring-1 focus:ring-[#1C9A6C] text-sm text-[#141414] placeholder:text-[#A3A3A3] outline-hidden transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="preorder-address"
                  className="block text-xs font-bold text-[#141414] uppercase tracking-wider mb-1"
                >
                  Flat, House No., Building &amp; Street Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="preorder-address"
                  required
                  rows={2}
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="e.g. Flat 301, Tower B, Green Glen Layout, Bellandur"
                  className="w-full px-3.5 py-2 rounded-md border border-[#D5D4CE] focus:border-[#1C9A6C] focus:ring-1 focus:ring-[#1C9A6C] text-sm text-[#141414] placeholder:text-[#A3A3A3] outline-hidden resize-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label
                    htmlFor="preorder-city"
                    className="block text-[11px] font-bold text-[#141414] uppercase tracking-wider mb-1"
                  >
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="preorder-city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bengaluru"
                    className="w-full px-3 py-2 rounded-md border border-[#D5D4CE] focus:border-[#1C9A6C] focus:ring-1 focus:ring-[#1C9A6C] text-xs text-[#141414] placeholder:text-[#A3A3A3] outline-hidden transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="preorder-state"
                    className="block text-[11px] font-bold text-[#141414] uppercase tracking-wider mb-1"
                  >
                    State
                  </label>
                  <input
                    id="preorder-state"
                    type="text"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="Karnataka"
                    className="w-full px-3 py-2 rounded-md border border-[#D5D4CE] focus:border-[#1C9A6C] focus:ring-1 focus:ring-[#1C9A6C] text-xs text-[#141414] placeholder:text-[#A3A3A3] outline-hidden transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="preorder-pincode"
                    className="block text-[11px] font-bold text-[#141414] uppercase tracking-wider mb-1"
                  >
                    PIN Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="preorder-pincode"
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="560103"
                    className="w-full px-3 py-2 rounded-md border border-[#D5D4CE] focus:border-[#1C9A6C] focus:ring-1 focus:ring-[#1C9A6C] text-xs text-[#141414] placeholder:text-[#A3A3A3] outline-hidden transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                id="submit-preorder-button"
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md bg-[#1C9A6C] hover:bg-[#167e58] disabled:opacity-50 text-white text-sm font-bold tracking-wide transition-colors cursor-pointer shadow-xs"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving Pre-Order to Database...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Pre-Order (₹{totalAmount})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-[#717171] mt-2">
                🔒 Stored securely in Firestore &bull; No upfront payment required
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
