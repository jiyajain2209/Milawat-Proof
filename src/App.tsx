import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { TrustStrip } from './components/TrustStrip';
import { WhyWeExist } from './components/WhyWeExist';
import { HowItWorks } from './components/HowItWorks';
import { ShopSection } from './components/ShopSection';
import { FAQ } from './components/FAQ';
import { ContactSection } from './components/ContactSection';
import { CartDrawer } from './components/CartDrawer';
import { PreOrderCheckoutModal } from './components/PreOrderCheckoutModal';
import { LiquidWaveDivider } from './components/LiquidWaveDivider';
import { AdminPortal } from './components/admin/AdminPortal';
import { Product, CartItem, Order } from './types';
import { fetchShopifyProducts, createShopifyCheckout } from './services/shopify';

export default function App() {
  const [shopifyProductsMap, setShopifyProductsMap] = useState<Record<string, string>>({});
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<'store' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      return path.startsWith('/admin') || hash === '#/admin' || hash === '#admin'
        ? 'admin'
        : 'store';
    }
    return 'store';
  });

  const [activeNav, setActiveNav] = useState('home');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    // Start with empty pre-orders cart
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const isAdmin =
        path.startsWith('/admin') || hash === '#/admin' || hash === '#admin';
      setCurrentRoute(isAdmin ? 'admin' : 'store');
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    
    // Fetch Shopify products
    fetchShopifyProducts().then((products) => {
      const map: Record<string, string> = {};
      products.forEach((p: any) => {
        if (p.title && p.variantId) {
          map[p.title] = p.variantId;
        }
      });
      setShopifyProductsMap(map);
    });

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigateToRoute = (route: 'store' | 'admin') => {
    setCurrentRoute(route);
    if (route === 'admin') {
      window.history.pushState(null, '', '/admin');
    } else {
      window.history.pushState(null, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2800);
  };

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`Added "${product.name}" to pre-orders.`);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from pre-orders.');
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      showToast('Cart is empty.');
      return;
    }

    setIsCheckoutLoading(true);
    
    const checkoutItems = cartItems.map(item => {
      const variantId = shopifyProductsMap[item.product.name];
      if (!variantId) {
        console.error(`No Shopify variant found for product: ${item.product.name}`);
      }
      return {
        variantId: variantId,
        quantity: item.quantity
      };
    }).filter(item => item.variantId);

    if (checkoutItems.length === 0) {
      setIsCheckoutLoading(false);
      showToast('None of the items in your cart are available for checkout currently.');
      return;
    }

    try {
      const checkoutUrl = await createShopifyCheckout(checkoutItems);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error creating checkout:', error);
      showToast('Failed to initiate checkout. Please try again.');
      setIsCheckoutLoading(false);
    }
  };

  const handleOrderSuccess = (order: Order) => {
    setCartItems([]);
    showToast(`Pre-order ${order.orderId} registered! Pending manual verification.`);
  };

  const handleNavigate = (navId: string) => {
    if (navId === 'admin') {
      navigateToRoute('admin');
      return;
    }

    if (currentRoute === 'admin') {
      navigateToRoute('store');
    }

    setActiveNav(navId);
    const labelMap: Record<string, string> = {
      home: 'Home',
      shop: 'Shop Test Kits',
      'how-it-works': 'How Testing Works',
      'our-story': 'Our Story',
      faq: 'FAQ',
      contact: 'Contact',
    };
    showToast(`Navigated to ${labelMap[navId] || navId}`);

    // Scroll to the targeted section
    const targetElement = document.getElementById(navId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    } else if (navId === 'shop') {
      const shopEl = document.getElementById('shop');
      if (shopEl) shopEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // If in protected admin route, display the Admin Portal
  if (currentRoute === 'admin') {
    return (
      <AdminPortal
        onNavigateToStore={() => navigateToRoute('store')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#141414] font-sans selection:bg-[#1C9A6C]/20 selection:text-[#141414]">
      {/* Toast notification for interaction feedback */}
      {toastMessage && (
        <div
          id="system-toast-feedback"
          className="fixed bottom-6 right-6 z-50 bg-[#141414] text-white text-xs sm:text-sm px-4 py-2.5 rounded-md shadow-md border border-neutral-800 flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-[#1C9A6C]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation Header */}
      <Header
        activeNav={activeNav}
        onNavigate={handleNavigate}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        {/* Homepage Hero Section */}
        <Hero
          onShopClick={() => handleNavigate('shop')}
          onHowItWorksClick={() => handleNavigate('how-it-works')}
        />

        {/* Liquid Wave Edge Divider (Hero to Shop Shelf) */}
        <LiquidWaveDivider id="divider-hero-shop" variant="warm" containerBg="bg-white" />

        {/* Shop Section: All 8 Test Kits (Single-Use and Multi-Use Tiers) */}
        <ShopSection onAddToCart={handleAddToCart} />

        {/* Liquid Wave Edge Divider (Shop Shelf to Why We Exist) */}
        <LiquidWaveDivider id="divider-shop-why" variant="warm" containerBg="bg-white" flipped />

        {/* Why Milawat Proof Exists Section */}
        <WhyWeExist />

        {/* How It Works: 3-step simple process */}
        <HowItWorks />

        {/* Thin Trust Markers Strip */}
        <TrustStrip />

        {/* FAQ Section */}
        <FAQ />

        {/* Contact Page/Section with Form */}
        <ContactSection onSuccessToast={showToast} />
      </main>

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      {/* Pre-Order Checkout Modal */}
      <PreOrderCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        items={cartItems}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Main Footer in Dark Aesthetic */}
      <Footer onNavigate={handleNavigate} onToast={showToast} />
    </div>
  );
}

