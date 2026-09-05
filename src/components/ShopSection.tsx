import React, { useState } from 'react';
import { Product } from '../types';
import { products } from '../data/products';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { ShieldCheck, Layers, RefreshCw, Zap, Sparkles } from 'lucide-react';

interface ShopSectionProps {
  onAddToCart: (product: Product) => void;
}

export const ShopSection: React.FC<ShopSectionProps> = ({ onAddToCart }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTierFilter, setActiveTierFilter] = useState<'all' | 'single' | 'multi'>('all');

  // Segregate the 8 products into two clearly labeled tiers
  const singleUseKits = products.filter((p) => p.tier === 'single');
  const multiUseKits = products.filter((p) => p.tier === 'multi');

  const showSingleTier = activeTierFilter === 'all' || activeTierFilter === 'single';
  const showMultiTier = activeTierFilter === 'all' || activeTierFilter === 'multi';

  return (
    <section
      id="shop"
      className="w-full bg-[#FAF9F5] py-16 sm:py-20 lg:py-24 border-b border-[#e5e4de]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Headline */}
        <div className="max-w-3xl mb-8 sm:mb-12">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1C9A6C] block mb-2">
            The Apothecary Shelf
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#141414] tracking-tight">
            At-Home Purity Testing Kits
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#525252] leading-relaxed">
            Clinical-grade chemical test kits designed for Indian kitchen counters. Choose between single-test kits for immediate verification or multi-use kits for ongoing family safety.
          </p>
        </div>

        {/* Tier Selector Toggle Tabs */}
        <div className="mb-12 bg-white p-1.5 rounded-xl border border-[#e5e4de] shadow-2xs inline-flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTierFilter('all')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTierFilter === 'all'
                ? 'bg-[#141414] text-white shadow-xs'
                : 'text-[#525252] hover:text-[#141414] hover:bg-[#F5F4F0]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Kits (8 Products)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTierFilter('single')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTierFilter === 'single'
                ? 'bg-[#1C9A6C] text-white shadow-xs'
                : 'text-[#525252] hover:text-[#141414] hover:bg-[#F5F4F0]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Single-Use Kits (4)</span>
            <span className={`text-[10px] py-0.5 px-1.5 rounded ${activeTierFilter === 'single' ? 'bg-white/20 text-white' : 'bg-[#F5F4F0] text-[#717171]'}`}>
              1 Test / Kit
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTierFilter('multi')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTierFilter === 'multi'
                ? 'bg-[#1C9A6C] text-white shadow-xs'
                : 'text-[#525252] hover:text-[#141414] hover:bg-[#F5F4F0]'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Multi-Use Kits (4)</span>
            <span className={`text-[10px] py-0.5 px-1.5 rounded ${activeTierFilter === 'multi' ? 'bg-white/20 text-white' : 'bg-[#F5F4F0] text-[#717171]'}`}>
              Multi-Test
            </span>
          </button>
        </div>

        {/* TIER 1: SINGLE-USE KITS ROW */}
        {showSingleTier && (
          <div id="tier-single-use-section" className="mb-16">
            
            {/* Tier 1 Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 mb-6 border-b border-[#e5e4de] gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#141414] text-white">
                    Tier 1
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#F5F4F0] text-[#525252] border border-[#e5e4de]">
                    One test per kit
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-[#141414] tracking-tight">
                  Single-Use Kits
                </h3>
                <p className="text-xs sm:text-sm text-[#525252] mt-1 max-w-2xl">
                  One test, one clear answer. Perfect for trying us out for the first time, checking a new milk source, or a quick one-off doubt you want settled fast.
                </p>
              </div>

              <div className="text-xs text-[#717171] shrink-0 font-medium">
                ₹200 – ₹500 &bull; 4 products
              </div>
            </div>

            {/* Tier 1 Cards Grid: 4 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
              {singleUseKits.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onViewDetails={setSelectedProduct}
                  isBestValueInTier={Boolean(product.isBestValue)}
                />
              ))}
            </div>

          </div>
        )}

        {/* Divider if both tiers are displayed */}
        {activeTierFilter === 'all' && (
          <div className="my-14 border-t border-[#e5e4de] relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FAF9F5] px-4 text-xs font-bold uppercase tracking-[0.16em] text-[#717171]">
              Need Multi-Use Kits for Routine Testing?
            </div>
          </div>
        )}

        {/* TIER 2: MULTI-USE KITS ROW */}
        {showMultiTier && (
          <div id="tier-multi-use-section" className="mb-8">
            
            {/* Tier 2 Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 mb-6 border-b border-[#e5e4de] gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#1C9A6C] text-white">
                    Tier 2
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#1C9A6C]/10 text-[#1C9A6C] border border-[#1C9A6C]/20">
                    Multiple tests per kit
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-[#141414] tracking-tight">
                  Multi-Use Kits
                </h3>
                <p className="text-xs sm:text-sm text-[#525252] mt-1 max-w-2xl">
                  Laboratory-grade testing reagent bottles and dropper vials. Designed for weekly household purity monitoring.
                </p>
              </div>

              <div className="text-xs text-[#717171] shrink-0 font-medium">
                ₹500 – ₹1,300 &bull; 4 products
              </div>
            </div>

            {/* Tier 2 Cards Grid: 4 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
              {multiUseKits.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onViewDetails={setSelectedProduct}
                  isPopularAcrossShop={Boolean(product.isPopular)}
                />
              ))}
            </div>

          </div>
        )}

        {/* Shelf Quality & Batch Standard */}
        <div className="mt-12 p-4 sm:p-5 rounded-xl bg-white border border-[#e5e4de] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#525252]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1C9A6C]/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#1C9A6C]" />
            </div>
            <div>
              <span className="font-bold text-[#141414] block">
                Standardized Chemistry Batch MP2405:
              </span>
              <span className="text-[#717171]">
                Every kit contains sealed, moisture-proof colorimetric ampoules. 12-month shelf life under ambient room temperature.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[#717171] shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#1C9A6C]" />
            <span>Zero Toxic Residue &bull; Safe for Kitchen Counters</span>
          </div>
        </div>

      </div>

      {/* Product Details Modal for Comprehensive Inspection */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={onAddToCart}
      />
    </section>
  );
};
