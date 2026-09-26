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
  description: "A full-stack ecommerce marketplace with PKR pricing.",
  icons: [{ rel: "icon", url: "/icon.svg" }]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var attrs = ["bis_skin_checked", "fdprocessedid"];
                var selector = attrs.map(function (attr) {
                  return "[" + attr + "]";
                }).join(",");
                var strip = function (root) {
                  if (!root || root.nodeType !== 1) return;
                  if (root.hasAttribute) {
                    attrs.forEach(function (attr) {
                      if (root.hasAttribute(attr)) {
                        root.removeAttribute(attr);
                      }
                    });
                  }
                  if (root.querySelectorAll) {
                    root.querySelectorAll(selector).forEach(function (node) {
                      attrs.forEach(function (attr) {
                        node.removeAttribute(attr);
                      });
                    });
                  }
                };
                var start = function () {
                  strip(document.documentElement);
                  if (!window.MutationObserver || !document.documentElement) return;
                  var observer = new MutationObserver(function (mutations) {
                    mutations.forEach(function (mutation) {
                      if (mutation.type === "attributes" && attrs.indexOf(mutation.attributeName) >= 0) {
                        mutation.target.removeAttribute(mutation.attributeName);
                      }
                      mutation.addedNodes.forEach(strip);
                    });
                  });
                  observer.observe(document.documentElement, {
                    attributes: true,
                    attributeFilter: attrs,
                    childList: true,
                    subtree: true
                  });
                  window.addEventListener("load", function () {
                    window.setTimeout(function () {
                      observer.disconnect();
                    }, 5000);
                  }, { once: true });
                };
                if (document.documentElement) {
                  start();
                } else {
                  document.addEventListener("DOMContentLoaded", start, { once: true });
                }
              })();
            `
          }}
        />
      </head>
      <body id="top" suppressHydrationWarning>
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
