import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  isCheckoutLoading?: boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  isCheckoutLoading = false,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 overflow-hidden bg-[#141414]/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="cart-drawer-panel"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#e5e4de] animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pre-Orders Header */}
        <div className="p-5 border-b border-[#F5F4F0] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#1C9A6C]" />
            <h3 className="font-bold text-base text-[#141414]">Your Pre-Orders</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F5F4F0] text-[#717171]">
              {items.reduce((acc, i) => acc + i.quantity, 0)} {items.reduce((acc, i) => acc + i.quantity, 0) === 1 ? 'kit' : 'kits'}
            </span>
          </div>

          <button
            id="close-cart-drawer-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded text-[#717171] hover:text-[#141414] hover:bg-[#F5F4F0]"
            aria-label="Close pre-orders"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-[#F5F4F0]">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#717171]">
              <div className="w-12 h-12 rounded-full bg-[#F5F4F0] flex items-center justify-center mb-3">
                <ShoppingBag className="w-6 h-6 text-[#717171]" />
              </div>
              <p className="text-base font-semibold text-[#141414]">No pre-orders yet</p>
              <p className="text-xs text-[#717171] mt-1 max-w-xs">
                Select a milk, paneer, or ghee diagnostic kit from the shelf to pre-order for your kitchen.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="pt-4 first:pt-0 flex gap-4 items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#141414] truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-xs text-[#717171] mt-0.5">
                    {item.product.testCount}
                  </p>
                  <p className="text-sm font-black text-[#141414] mt-1">
                    ₹{item.product.price}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-[#e5e4de] rounded bg-white">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.product.id, -1)}
                      className="px-2.5 py-1 text-xs text-[#141414] hover:bg-[#F5F4F0] font-medium"
                    >
                      -
                    </button>
                    <span className="px-2 text-xs font-bold text-[#141414]">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.product.id, 1)}
                      className="px-2.5 py-1 text-xs text-[#141414] hover:bg-[#F5F4F0] font-medium"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-1.5 text-neutral-400 hover:text-[#D6432E] transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Subtotal & Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#F5F4F0] bg-[#F5F4F0]/40 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#717171]">Estimated Subtotal</span>
              <span className="font-bold text-lg text-[#141414]">₹{subtotal}</span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-[#1C9A6C] font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Free Pan-India Express Delivery &bull; Priority Batch Allocation</span>
            </div>

            <button
              id="confirm-preorder-btn"
              type="button"
              onClick={onCheckout}
              disabled={isCheckoutLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md bg-[#1C9A6C] hover:bg-[#167e58] disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-semibold tracking-wide transition-colors cursor-pointer"
            >
              {isCheckoutLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Redirecting to checkout...</span>
                </>
              ) : (
                <>
                  <span>Confirm Pre-Order</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
