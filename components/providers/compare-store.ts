"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type CompareStore = {
  ids: string[];
  toggle: (id: string) => void;
  clear: () => void;
};

export const useCompareStore = create<CompareStore>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id) ? state.ids.filter((item) => item !== id) : [...state.ids, id].slice(-4)
        })),
      clear: () => set({ ids: [] })
    }),
    { name: "8x-compare" }
  )
);
