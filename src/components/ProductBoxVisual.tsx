import React from 'react';
import { Product } from '../types';

interface ProductBoxVisualProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProductBoxVisual: React.FC<ProductBoxVisualProps> = ({
  product,
  size = 'md',
  className = '',
}) => {
  const scaleClass = {
    sm: 'w-full h-44 sm:h-52',
    md: 'w-full h-56 sm:h-64',
    lg: 'w-full h-72 sm:h-80',
  }[size];

  return (
    <div
      id={`box-photo-${product.id}`}
      className={`relative flex items-center justify-center select-none overflow-hidden ${scaleClass} ${className}`}
      aria-label={`Product packaging photo of ${product.name}`}
    >
      <img
        src="/image.png"
        alt={`Milawat Proof Home Adulteration Test Kit - ${product.name}`}
        className="w-full h-full object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105"
        referrerPolicy="no-referrer"
        loading="lazy"
      />
    </div>
  );
};
