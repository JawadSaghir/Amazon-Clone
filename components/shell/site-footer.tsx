import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-coal text-paper">
      <div className="page-shell grid gap-8 py-10 sm:grid-cols-4">
        {[
          ["Shop", "Deals", "New arrivals", "8x Prime"],
          ["Sell", "Seller console", "Fulfilment", "Brand tools"],
          ["Help", "Orders", "Returns", "Payments"],
          ["Regions", "India", "Pakistan", "INR / PKR"]
        ].map(([title, ...links]) => (
          <div key={title}>
            <h3 className="font-black text-saffron">{title}</h3>
            <div className="mt-3 grid gap-2 text-sm text-paper/70">
              {links.map((link) => (
                <Link key={link} href="#" className="hover:text-paper">
                  {link}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-paper/60">
        8x Marketplace. Demo catalog and test-mode payment flow.
      </div>
    </footer>
  );
}
