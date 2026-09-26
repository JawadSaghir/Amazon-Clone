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

function isDatabaseProductId(id: string) {
  return /^[a-f\d]{24}$/i.test(id);
}

function keepDatabaseCartItems(items: CartItem[]) {
  return items.filter((item) => isDatabaseProductId(item.product.id));
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product, quantity = 1) =>
        set((state) => {
          const items = keepDatabaseCartItems(state.items);
          const existing = items.find((item) => item.product.id === product.id);
          if (existing) {
            return {
              items: items.map((item) =>
                item.product.id === product.id ? { ...item, quantity: Math.min(10, item.quantity + quantity) } : item
              )
            };
          }
          return { items: [...items, { product, quantity }] };
        }),
      remove: (productId) => set((state) => ({ items: state.items.filter((item) => item.product.id !== productId) })),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) => (item.product.id === productId ? { ...item, quantity: Math.max(1, Math.min(10, quantity)) } : item))
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((sum, item) => sum + item.quantity, 0)
    }),
    {
      name: "8x-cart",
      version: 2,
      migrate: (persistedState) => {
        const state = persistedState as CartStore;
        return { ...state, items: keepDatabaseCartItems(state.items ?? []) };
      }
    }
  )
);
