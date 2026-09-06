import React from 'react';
import { Product } from '../types';
import { ShoppingBag, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
}) => {
  const isBundle = product.isBestValue;
  
  return (
    <div
      id={`product-card-${product.id}`}
      className={`bg-white rounded-xl border flex flex-col justify-between relative transition-all duration-200 p-5 sm:p-6 ${
        isBundle 
          ? 'border-[#1C9A6C] shadow-lg md:scale-105 z-10' 
          : 'border-[#e5e4de] hover:border-[#1C9A6C]/50'
      }`}
    >
      {isBundle && product.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1C9A6C] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-sm">
          <Sparkles className="w-3 h-3" />
          {product.badge}
        </div>
      )}
      
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
        <div className="flex items-baseline gap-2 mb-3">
          {product.originalPrice && (
            <span className="text-sm font-medium text-[#A3A3A3] line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
          <span className={`text-xl font-black tracking-tight ${product.originalPrice ? 'text-[#1C9A6C]' : 'text-[#141414]'}`}>
            ₹{product.price.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Action Button */}
        <button
          id={`pre-order-${product.id}`}
          type="button"
          onClick={() => onAddToCart(product)}
          aria-label={`Pre-Order ${product.name}`}
          className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-md text-xs font-bold tracking-wide transition-colors cursor-pointer ${
            isBundle 
              ? 'bg-[#1C9A6C] hover:bg-[#167e58] text-white' 
              : 'bg-[#1C9A6C] hover:bg-[#167e58] text-white'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};
