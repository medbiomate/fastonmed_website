'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Coupon } from './types';

interface AppContextType {
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedAttributes?: Record<string, string>, variationId?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartTax: number;
  cartShipping: number;
  cartGrandTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Compare
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;

  // Quick View
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  // Quote Request
  quoteProduct: Product | null;
  openQuoteModal: (product?: Product) => void;
  closeQuoteModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quoteProduct, setQuoteProduct] = useState<Product | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('fastonmed_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('fastonmed_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('fastonmed_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('fastonmed_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  // Cart operations
  const addToCart = (product: Product, quantity = 1, selectedAttributes?: Record<string, string>, variationId?: string) => {
    const itemKey = variationId ? `${product.id}-${variationId}` : product.id;
    const price = product.salePrice && product.salePrice > 0 ? product.salePrice : product.regularPrice;

    setCart(prev => {
      const existing = prev.find(item => item.id === itemKey);
      if (existing) {
        return prev.map(item =>
          item.id === itemKey
            ? { ...item, quantity: Math.min(item.quantity + quantity, item.maxStock) }
            : item
        );
      }
      return [
        ...prev,
        {
          id: itemKey,
          productId: product.id,
          variationId,
          name: product.name,
          sku: product.sku,
          price,
          quantity,
          image: product.mainImage,
          selectedAttributes,
          maxStock: product.stockQuantity
        }
      ];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === cartItemId ? { ...item, quantity: Math.min(quantity, item.maxStock) } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = async (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'WELCOME10') {
      const coupon: Coupon = {
        id: 'cp-welcome',
        code: 'WELCOME10',
        description: '10% Welcome Discount',
        discountType: 'percentage',
        discountValue: 10,
        usageCount: 1,
        isActive: true
      };
      setAppliedCoupon(coupon);
      return { success: true, message: 'Coupon WELCOME10 applied! (10% Off)' };
    }
    if (clean === 'UAECARE50') {
      const coupon: Coupon = {
        id: 'cp-care',
        code: 'UAECARE50',
        description: 'AED 50 Discount',
        discountType: 'fixed',
        discountValue: 50,
        usageCount: 1,
        isActive: true
      };
      setAppliedCoupon(coupon);
      return { success: true, message: 'Coupon UAECARE50 applied! (AED 50 Off)' };
    }
    return { success: false, message: 'Invalid or expired coupon code.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = (cartSubtotal * appliedCoupon.discountValue) / 100;
    } else {
      discount = appliedCoupon.discountValue;
    }
  }

  const postDiscountSubtotal = Math.max(0, cartSubtotal - discount);
  const cartShipping = postDiscountSubtotal >= 500 || postDiscountSubtotal === 0 ? 0 : 25; // Free over AED 500
  const cartTax = Math.round(postDiscountSubtotal * 0.05 * 100) / 100; // UAE 5% VAT
  const cartGrandTotal = postDiscountSubtotal + cartShipping + cartTax;

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => (prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]));
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Compare
  const addToCompare = (product: Product) => {
    if (compareList.length >= 4) {
      alert('You can compare up to 4 medical equipment items simultaneously.');
      return;
    }
    if (!compareList.some(p => p.id === product.id)) {
      setCompareList(prev => [...prev, product]);
    }
    setIsCompareOpen(true);
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(prev => prev.filter(p => p.id !== productId));
  };

  const clearCompare = () => setCompareList([]);

  const isInCompare = (productId: string) => compareList.some(p => p.id === productId);

  // Modals
  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  const openQuoteModal = (product?: Product) => setQuoteProduct(product || null);
  const closeQuoteModal = () => setQuoteProduct(null);

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartTax,
        cartShipping,
        cartGrandTotal,
        isCartOpen,
        setIsCartOpen,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        isCompareOpen,
        setIsCompareOpen,
        quickViewProduct,
        openQuickView,
        closeQuickView,
        quoteProduct,
        openQuoteModal,
        closeQuoteModal
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
