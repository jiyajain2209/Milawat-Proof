import React, { useState } from 'react';
import { Logo } from './Logo';
import { Menu, X, ArrowRight, ShoppingBag } from 'lucide-react';

interface HeaderProps {
  activeNav?: string;
  onNavigate?: (navId: string) => void;
  cartCount?: number;
  onOpenCart?: () => void;
}

export const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'shop', label: 'Shop' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'our-story', label: 'Our Story' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
];

export const Header: React.FC<HeaderProps> = ({
  activeNav = 'home',
  onNavigate,
  cartCount = 0,
  onOpenCart,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-navigation-header"
      className="sticky top-0 z-50 w-full bg-white border-b border-[#F5F4F0]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Logo Lockup */}
          <div className="flex items-center">
            <button
              id="header-logo-btn"
              type="button"
              onClick={() => handleNavClick('home')}
              className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C9A6C] rounded p-1 -m-1 transition-opacity hover:opacity-90"
              aria-label="Milawat Proof Home"
            >
              <Logo size="md" />
            </button>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav
            id="desktop-nav-links"
            aria-label="Main Navigation"
            className="hidden md:flex items-center space-x-1 lg:space-x-2"
          >
            {navItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 text-[14px] font-medium transition-colors cursor-pointer rounded-md ${
                    isActive
                      ? 'text-[#141414] font-semibold bg-[#F5F4F0]'
                      : 'text-[#525252] hover:text-[#141414] hover:bg-[#F5F4F0]/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Pre-Orders Button & Sticky "Shop Now" button */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Pre-Orders Button */}
            <button
              id="header-cart-btn"
              type="button"
              onClick={onOpenCart}
              className="relative p-2 rounded-md text-[#141414] hover:bg-[#F5F4F0] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C9A6C] cursor-pointer"
              aria-label={`Pre-Orders (${cartCount} ${cartCount === 1 ? 'item' : 'items'})`}
              title="View Pre-Orders"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1C9A6C] text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              id="sticky-shop-now-btn"
              type="button"
              onClick={() => handleNavClick('shop')}
              className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-md bg-[#1C9A6C] hover:bg-[#167e58] text-white text-[14px] font-semibold tracking-wide transition-colors shadow-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1C9A6C]"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                id="mobile-menu-toggle-btn"
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-[#141414] hover:bg-[#F5F4F0] focus:outline-none focus:ring-2 focus:ring-[#1C9A6C]"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="md:hidden border-t border-[#F5F4F0] bg-white px-4 pt-2 pb-5 space-y-1"
        >
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-link-${item.id}`}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-[#F5F4F0] text-[#141414] font-semibold'
                    : 'text-[#525252] hover:bg-[#F5F4F0]/60 hover:text-[#141414]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
