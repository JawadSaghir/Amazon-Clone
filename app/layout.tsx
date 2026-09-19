import type { Metadata } from "next";
import { Suspense } from "react";

import { AppProviders } from "@/components/providers/app-providers";
import { SiteFooter } from "@/components/shell/site-footer";
import { SiteHeader } from "@/components/shell/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "8x Marketplace",
    template: "%s | 8x Marketplace"
  },
  description: "A full-stack ecommerce marketplace with INR and PKR pricing.",
  icons: [{ rel: "icon", url: "/icon.svg" }]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body id="top">
        <AppProviders>
          <Suspense fallback={null}>
            <SiteHeader />
          </Suspense>
          <main className="min-h-screen">{children}</main>
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
