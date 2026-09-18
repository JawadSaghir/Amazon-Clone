"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type RecentStore = {
  ids: string[];
  push: (id: string) => void;
};

export const useRecentStore = create<RecentStore>()(
  persist(
    (set) => ({
      ids: [],
      push: (id) => set((state) => ({ ids: [id, ...state.ids.filter((item) => item !== id)].slice(0, 8) }))
    }),
    { name: "8x-recent" }
  )
);
