"use client";

import { SessionStoreProvider } from "@/components/providers/session-store";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <SessionStoreProvider>{children}</SessionStoreProvider>;
}
