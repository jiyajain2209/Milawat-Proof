import React, { useState } from 'react';
import { Product } from '../types';
import { products } from '../data/products';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { ShieldCheck } from 'lucide-react';

interface ShopSectionProps {
  onAddToCart: (product: Product) => void;
}

export const ShopSection: React.FC<ShopSectionProps> = ({ onAddToCart }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <section
      id="shop"
      className="w-full bg-[#FAF9F5] py-16 sm:py-20 lg:py-24 border-b border-[#e5e4de]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Headline */}
        <div className="max-w-3xl mb-12">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1C9A6C] block mb-2">
            The Apothecary Shelf
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#141414] tracking-tight">
            At-Home Purity Testing Kits
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#525252] leading-relaxed">
            Clinical-grade chemical test kits designed for Indian kitchen counters. Check your food for adulterants instantly.
          </p>
        </div>

        {/* Product Cards Grid: 4 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onViewDetails={setSelectedProduct}
            />
          ))}
        </div>

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
