"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartItem = {
  id: string;
  nameEn: string;
  nameAr: string;
  priceSar: number;
  validityDays: number;
  maxSeats: number;
  addedAt: string;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (pkg: Omit<CartItem, "addedAt">) => boolean;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalPrice: number;
  isInCart: (id: string) => boolean;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "tasheel_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as CartItem[];
        // Deduplicate by ID — keep the first occurrence
        const seen = new Set<string>();
        const deduped = parsed.filter((item) => {
          if (seen.has(item.id)) return false;
          seen.add(item.id);
          return true;
        });
        setCartItems(deduped);
      } catch {
        setCartItems([]);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, hydrated]);

  const addToCart = (pkg: Omit<CartItem, "addedAt">): boolean => {
    let added = false;
    setCartItems((prev) => {
      if (prev.some((item) => item.id === pkg.id)) {
        // Already in cart — do not add
        return prev;
      }
      added = true;
      return [...prev, { ...pkg, addedAt: new Date().toISOString() }];
    });
    return added;
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const isInCart = (id: string) => cartItems.some((item) => item.id === id);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (Number(item.priceSar) || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, totalPrice, isInCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
