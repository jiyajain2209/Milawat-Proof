import React from 'react';
import { Product } from '../types';
import { Sparkles, Award, Eye, Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  isPopularAcrossShop?: boolean;
  isBestValueInTier?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
  isPopularAcrossShop = false,
  isBestValueInTier = false,
}) => {
  const isCombo = product.category === 'bundle';

  // Specific styling based on product tier and hierarchy
  // Combos visually stand out slightly (thin green border)
  // Multi-Use Combo is visually bigger with "Most Popular" badge
  const borderClasses = isPopularAcrossShop
    ? 'border-2 border-[#1C9A6C] shadow-xs'
    : isBestValueInTier
    ? 'border border-[#1C9A6C] shadow-2xs'
    : isCombo
    ? 'border border-[#1C9A6C]/70'
    : 'border border-[#e5e4de] hover:border-[#1C9A6C]/50';

  const cardPadding = isPopularAcrossShop ? 'p-6 sm:p-7' : 'p-5 sm:p-6';

  return (
    <div
      id={`product-card-${product.id}`}
      className={`bg-white rounded-xl ${borderClasses} flex flex-col justify-between relative transition-all duration-200 ${cardPadding}`}
    >
      {/* Top Prominent Badge: "Most Popular" across the whole shop */}
      {isPopularAcrossShop && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C9A6C] text-white text-[11px] font-bold uppercase tracking-[0.14em] shadow-xs">
            <Sparkles className="w-3 h-3 text-white" />
            Most Popular Across Shop
          </span>
        </div>
      )}

      {/* Top Badge for Single-Use Tier Combo: "Best Value" */}
      {isBestValueInTier && !isPopularAcrossShop && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#1C9A6C] text-white text-[10px] font-bold uppercase tracking-[0.12em] shadow-xs">
            <Award className="w-3 h-3 text-white" />
            Best Value in Tier
          </span>
        </div>
      )}

      {/* Card Header: Tier Label & Test Count */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3.5 pt-1">
          {/* Tier Label (Single-Use / Multi-Use) strictly per prompt */}
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase ${
              product.tier === 'multi'
                ? 'bg-[#1C9A6C]/10 text-[#1C9A6C] border border-[#1C9A6C]/20'
                : 'bg-[#F5F4F0] text-[#525252] border border-[#e5e4de]'
            }`}
          >
            {product.tierLabel}
          </span>

          <span className="text-[11px] text-[#717171] font-semibold tracking-wider uppercase">
            {product.testCount.split(' ')[0]} {product.tier === 'single' ? 'Test' : 'Tests'}
          </span>
        </div>

        {/* Product Image / Packaging Box Photo (exact uploaded image) */}
        <div
          className={`w-full aspect-[4/5] ${
            isPopularAcrossShop ? 'bg-[#1C9A6C]/5' : 'bg-[#F5F4F0]'
          } rounded-lg border ${
            isPopularAcrossShop ? 'border-[#1C9A6C]/25' : 'border-[#ebe9e3]'
          } flex items-center justify-center cursor-pointer p-2 sm:p-3 mb-4 transition-transform hover:scale-[1.01]`}
          onClick={() => onViewDetails(product)}
          title="Click to view packaging & chemical assay details"
        >
          <img
            src="/image.png"
            alt={`${product.name} packaging`}
            className="w-full h-full object-contain filter drop-shadow-2xs transition-transform duration-300 hover:scale-105"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </div>

        {/* Product Title */}
        <h3 className="text-base sm:text-[17px] font-bold text-[#141414] leading-snug tracking-tight">
          {product.name}
        </h3>

        {/* One-Line Description strictly per prompt */}
        <p className="text-xs text-[#525252] mt-1.5 line-clamp-2 leading-relaxed font-normal">
          {product.description}
        </p>

        {/* Target Adulterants Detected Bullet Checklist */}
        <div className="mt-3.5 pt-3 border-t border-[#F5F4F0] space-y-1.5">
          {product.testsCovered.slice(0, 3).map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-[11px] text-[#525252]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1C9A6C] shrink-0" />
              <span className="truncate">{item}</span>
            </div>
          ))}
          {product.testsCovered.length > 3 && (
            <span className="text-[10px] text-[#717171] italic block pl-3">
              + {product.testsCovered.length - 3} more adulterants
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Price & Pre-Order */}
      <div className="mt-6 pt-4 border-t border-[#F5F4F0]">
        <div className="flex items-baseline justify-between mb-3">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`${
                isPopularAcrossShop ? 'text-2xl' : 'text-xl'
              } font-black text-[#141414] tracking-tight`}
            >
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-[#717171] line-through font-normal">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <span className="text-[10px] text-[#717171] uppercase tracking-wider font-semibold">
            {product.tier === 'single' ? 'Single kit' : 'Multi-use'}
          </span>
        </div>

        {/* Action Buttons: Details & Pre-Order in Green Accent */}
        <div className="grid grid-cols-2 gap-2">
          <button
            id={`view-details-${product.id}`}
            type="button"
            onClick={() => onViewDetails(product)}
            className="inline-flex items-center justify-center gap-1 px-2.5 py-2 rounded-md border border-[#e5e4de] bg-white hover:bg-[#F5F4F0] text-[#141414] text-xs font-semibold tracking-normal transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#717171]" />
            <span>Details</span>
          </button>

          <button
            id={`pre-order-${product.id}`}
            type="button"
            onClick={() => onAddToCart(product)}
            aria-label={`Pre-Order ${product.name}`}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-[#1C9A6C] hover:bg-[#167e58] text-white text-xs font-bold tracking-wide transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            <span>Pre-Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};
