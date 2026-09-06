import React from 'react';
import { Product } from '../types';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
}) => {
  return (
    <div
      id={`product-card-${product.id}`}
      className={`bg-white rounded-xl border border-[#e5e4de] hover:border-[#1C9A6C]/50 flex flex-col justify-between relative transition-all duration-200 p-5 sm:p-6`}
    >
      <div>
        {/* Product Image / Packaging Box Photo (exact uploaded image) */}
        <div
          className={`w-full aspect-[4/5] bg-[#F5F4F0] rounded-lg border border-[#ebe9e3] flex items-center justify-center p-2 sm:p-3 mb-4`}
        >
          <img
            src={product.imageUrl || "/image.png"}
            alt={`${product.name} packaging`}
            className="w-full h-full object-contain filter drop-shadow-2xs"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </div>

        {/* Product Title */}
        <h3 className="text-base sm:text-[17px] font-bold text-[#141414] leading-snug tracking-tight">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-[#525252] mt-1.5 leading-relaxed font-normal">
          {product.description}
        </p>
      </div>

      {/* Card Footer: Price & Buy Now */}
      <div className="mt-6 pt-4 border-t border-[#F5F4F0]">
        <div className="flex items-baseline mb-3">
          <span className="text-xl font-black text-[#141414] tracking-tight">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Action Button */}
        <button
          id={`pre-order-${product.id}`}
          type="button"
          onClick={() => onAddToCart(product)}
          aria-label={`Pre-Order ${product.name}`}
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-md bg-[#1C9A6C] hover:bg-[#167e58] text-white text-xs font-bold tracking-wide transition-colors cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          <span>Pre-Order</span>
        </button>
      </div>
    </div>
  );
};
