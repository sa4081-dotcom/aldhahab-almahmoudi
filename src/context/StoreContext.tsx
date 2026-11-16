import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../data/initialStore';
import {
  CartItem,
  FilterCategory,
  Product,
  StoreSettings,
  ViewMode,
} from '../types/store';

const STORAGE_KEY = 'almahmoudi_natural_gold_store_v1';

interface PersistedStore {
  products: Product[];
  settings: StoreSettings;
  cart: CartItem[];
}

interface StoreContextValue {
  products: Product[];
  settings: StoreSettings;
  cart: CartItem[];
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  activeCategory: FilterCategory;
  setActiveCategory: (category: FilterCategory) => void;
  updateProductPrice: (productId: string, price: number) => void;
  updateProduct: (productId: string, updates: Partial<Omit<Product, 'id'>>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (productId: string) => void;
  resetAllPricesToZero: () => void;
  resetStoreToDefaults: () => void;
  updateSettings: (updates: Partial<StoreSettings>) => void;
  addToCart: (productId: string, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  effectiveShipping: number;
  isFreeShippingUnlocked: boolean;
  amountRemainingForFreeShipping: number;
  cartTotal: number;
  hasUnpricedItemsInCart: boolean;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function loadPersistedState(): PersistedStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        products: INITIAL_PRODUCTS,
        settings: INITIAL_SETTINGS,
        cart: [],
      };
    }
    const parsed = JSON.parse(raw) as Partial<PersistedStore>;
    return {
      products: Array.isArray(parsed.products) && parsed.products.length > 0
        ? parsed.products
        : INITIAL_PRODUCTS,
      settings: parsed.settings
        ? {
            shippingCost: Number(parsed.settings.shippingCost) || 0,
            freeShippingThreshold: Number(parsed.settings.freeShippingThreshold) || 0,
            whatsappNumber: parsed.settings.whatsappNumber || INITIAL_SETTINGS.whatsappNumber,
          }
        : INITIAL_SETTINGS,
      cart: Array.isArray(parsed.cart) ? parsed.cart : [],
    };
  } catch {
    return {
      products: INITIAL_PRODUCTS,
      settings: INITIAL_SETTINGS,
      cart: [],
    };
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [initialState] = useState<PersistedStore>(() => loadPersistedState());
  const [products, setProducts] = useState<Product[]>(initialState.products);
  const [settings, setSettings] = useState<StoreSettings>(initialState.settings);
  const [cart, setCart] = useState<CartItem[]>(initialState.cart);
  const [viewMode, setViewMode] = useState<ViewMode>('store');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('الكل');

  useEffect(() => {
    try {
      const payload: PersistedStore = { products, settings, cart };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage quota errors silently
    }
  }, [products, settings, cart]);

  const updateProductPrice = (productId: string, price: number) => {
    const safePrice = Number.isFinite(price) && price >= 0 ? price : 0;
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, price: safePrice } : p))
    );
  };

  const updateProduct = (productId: string, updates: Partial<Omit<Product, 'id'>>) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              ...updates,
              price:
                updates.price !== undefined
                  ? Number.isFinite(updates.price) && updates.price >= 0
                    ? updates.price
                    : 0
                  : p.price,
            }
          : p
      )
    );
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newId = `prod-${Date.now()}`;
    const safePrice = Number.isFinite(product.price) && product.price >= 0 ? product.price : 0;
    setProducts((prev) => [{ ...product, id: newId, price: safePrice }, ...prev]);
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const resetAllPricesToZero = () => {
    setProducts((prev) => prev.map((p) => ({ ...p, price: 0 })));
    setSettings((prev) => ({ ...prev, shippingCost: 0, freeShippingThreshold: 0 }));
  };

  const resetStoreToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setSettings(INITIAL_SETTINGS);
    setCart([]);
  };

  const updateSettings = (updates: Partial<StoreSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...updates,
      shippingCost:
        updates.shippingCost !== undefined
          ? Number.isFinite(updates.shippingCost) && updates.shippingCost >= 0
            ? updates.shippingCost
            : 0
          : prev.shippingCost,
      freeShippingThreshold:
        updates.freeShippingThreshold !== undefined
          ? Number.isFinite(updates.freeShippingThreshold) && updates.freeShippingThreshold >= 0
            ? updates.freeShippingThreshold
            : 0
          : prev.freeShippingThreshold,
    }));
  };

  const addToCart = (productId: string, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId, quantity }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const metrics = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    let unpriced = false;

    for (const item of cart) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) continue;
      count += item.quantity;
      if (product.price <= 0) {
        unpriced = true;
      } else {
        subtotal += product.price * item.quantity;
      }
    }

    const freeThreshold = settings.freeShippingThreshold;
    const isFreeUnlocked = freeThreshold > 0 && subtotal >= freeThreshold && count > 0;
    const effectiveShipping =
      count === 0 ? 0 : isFreeUnlocked ? 0 : settings.shippingCost;
    const amountRemaining =
      freeThreshold > 0 && subtotal < freeThreshold
        ? Math.max(0, freeThreshold - subtotal)
        : 0;

    return {
      cartCount: count,
      cartSubtotal: subtotal,
      effectiveShipping,
      isFreeShippingUnlocked: isFreeUnlocked,
      amountRemainingForFreeShipping: amountRemaining,
      cartTotal: subtotal + effectiveShipping,
      hasUnpricedItemsInCart: unpriced,
    };
  }, [cart, products, settings]);

  return (
    <StoreContext.Provider
      value={{
        products,
        settings,
        cart,
        viewMode,
        setViewMode,
        isCartOpen,
        setIsCartOpen,
        activeCategory,
        setActiveCategory,
        updateProductPrice,
        updateProduct,
        addProduct,
        deleteProduct,
        resetAllPricesToZero,
        resetStoreToDefaults,
        updateSettings,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        ...metrics,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return ctx;
}
