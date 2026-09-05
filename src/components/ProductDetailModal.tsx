import React from 'react';
import { Product } from '../types';
import { X, Check, ShieldCheck, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  return (
    <div
      id="product-detail-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#141414]/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="product-detail-modal-dialog"
        className="relative bg-white rounded-xl border border-[#e5e4de] w-full max-w-3xl overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F5F4F0] bg-[#F5F4F0]/40">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#1C9A6C]/10 text-[#1C9A6C]">
              {product.badge || '5-min results'}
            </span>
            <span className="text-xs text-[#717171] uppercase tracking-wider font-medium">
              Batch: {product.batchNo}
            </span>
          </div>

          <button
            id="close-product-modal-btn"
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-[#717171] hover:text-[#141414] hover:bg-[#F5F4F0] transition-colors focus:outline-none"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Packaging Photo (exact uploaded image) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center bg-[#F5F4F0] rounded-lg p-6 border border-[#ebe9e3]">
            <img
              src="/image.png"
              alt={`${product.name} packaging photo`}
              className="w-full max-h-[300px] object-contain filter drop-shadow-sm"
              referrerPolicy="no-referrer"
            />
            <span className="text-[11px] text-[#717171] mt-3 uppercase tracking-wider font-medium text-center">
              Dimension: {product.dimensions}
            </span>
          </div>

          {/* Product Specifications & Purchase */}
          <div className="md:col-span-7 space-y-5">
            <div>
              <span className="text-xs font-semibold text-[#1C9A6C] uppercase tracking-[0.16em]">
                {product.testCount}
              </span>
              <h3 className="text-2xl font-extrabold text-[#141414] mt-0.5">
                {product.name}
              </h3>
              <p className="text-sm text-[#525252] mt-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Adulterants tested */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#141414] block">
                Target Adulterants Detected:
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {product.testsCovered.map((test, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-[#141414]">
                    <div className="w-4 h-4 rounded-full bg-[#1C9A6C]/15 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 text-[#1C9A6C]" strokeWidth={3} />
                    </div>
                    <span>{test}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What's in the box */}
            <div className="bg-[#F5F4F0] p-3.5 rounded-lg border border-[#ebe9e3] space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#141414] block">
                Box Contents:
              </span>
              <ul className="text-xs text-[#525252] space-y-1">
                {product.whatsInside.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1C9A6C]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price and CTA */}
            <div className="pt-2 border-t border-[#F5F4F0] flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-[#717171] uppercase tracking-wider block">Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#141414]">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-[#717171] line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              <button
                id={`modal-pre-order-${product.id}`}
                type="button"
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#1C9A6C] hover:bg-[#167e58] text-white text-sm font-semibold tracking-wide transition-colors cursor-pointer"
              >
                <span>Pre-Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
