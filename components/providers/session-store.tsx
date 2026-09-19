"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type DemoSession = {
  user?: {
    id?: string;
    role?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
} | null;

type SessionState = {
  data: DemoSession;
  status: "loading" | "authenticated" | "unauthenticated";
  refresh: () => Promise<void>;
};

const SessionContext = createContext<SessionState | null>(null);

export function SessionStoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DemoSession>(null);
  const [status, setStatus] = useState<SessionState["status"]>("loading");

  async function refresh() {
    setStatus("loading");
    try {
      const response = await fetch("/api/auth/session", { cache: "no-store" });
      const session = (await response.json()) as DemoSession;
      setData(session?.user ? session : null);
      setStatus(session?.user ? "authenticated" : "unauthenticated");
    } catch {
      setData(null);
      setStatus("unauthenticated");
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  return <SessionContext.Provider value={{ data, status, refresh }}>{children}</SessionContext.Provider>;
}

export function useDemoSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useDemoSession must be used inside SessionStoreProvider");
  }
  return context;
}
