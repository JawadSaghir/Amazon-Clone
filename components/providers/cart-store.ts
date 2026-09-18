"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Product } from "@/types";

type CartItem = {
  product: Product;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  add: (product: Product, quantity?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  count: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id ? { ...item, quantity: Math.min(10, item.quantity + quantity) } : item
              )
            };
          }
          return { items: [...state.items, { product, quantity }] };
        }),
      remove: (productId) => set((state) => ({ items: state.items.filter((item) => item.product.id !== productId) })),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) => (item.product.id === productId ? { ...item, quantity: Math.max(1, Math.min(10, quantity)) } : item))
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((sum, item) => sum + item.quantity, 0)
    }),
    { name: "8x-cart" }
  )
);
