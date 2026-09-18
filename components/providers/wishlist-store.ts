"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistStore = {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
};

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => set((state) => ({ ids: state.ids.includes(id) ? state.ids.filter((item) => item !== id) : [...state.ids, id] })),
      has: (id) => get().ids.includes(id)
    }),
    { name: "8x-wishlist" }
  )
);
