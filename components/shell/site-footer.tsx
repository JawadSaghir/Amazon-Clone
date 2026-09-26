import Link from "next/link";

const footerGroups = [
  {
    title: "Get to know us",
    links: [
      ["About 8x Bazaar", "/info/about-8x"],
      ["Careers", "/info/careers"],
      ["Press Releases", "/info/press-releases"],
      ["8x Labs", "/info/8x-labs"]
    ]
  },
  {
    title: "Connect with us",
    links: [
      ["Facebook", "/info/facebook"],
      ["Twitter", "/info/twitter"],
      ["Instagram", "/info/instagram"]
    ]
  },
  {
    title: "Make money with us",
    links: [
      ["Sell on 8x", "/info/sell-on-8x"],
      ["Fulfilment by 8x", "/info/fulfilment-by-8x"],
      ["Advertise Your Products", "/info/advertise-your-products"]
    ]
  },
  {
    title: "Let us help you",
    links: [
      ["Your Account", "/info/your-account"],
      ["Returns Centre", "/info/returns-centre"],
      ["Payments", "/info/payments"],
      ["Help", "/info/help"]
    ]
  }
];

export function SiteFooter() {
  return (
    <footer className="glass-dark mt-0 text-paper/90">
      <Link href="#top" className="block bg-white/5 py-3 text-center text-sm font-bold hover:bg-white/10">
        Back to top
      </Link>
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-14 sm:grid-cols-5">
        <div className="sm:col-span-1">
          <Link href="/" className="font-display text-2xl font-bold text-white">
            8x<span className="text-amazonGold">bazaar</span>
          </Link>
          <p className="mt-4 max-w-[240px] text-[13px] leading-relaxed text-paper/60">
            A marketplace built for the everyday shop &mdash; electronics, fashion, home and more, priced in INR with a PKR estimate at checkout.
          </p>
        </div>
        {footerGroups.map(({ title, links }) => (
          <div key={title}>
            <h3 className="text-[12.5px] font-bold uppercase tracking-[0.08em] text-paper/50">{title}</h3>
            <div className="mt-4 grid gap-2.5 text-[13.5px] text-paper/80">
              {links.map(([label, href]) => (
                <Link key={href} href={href} className="hover:text-white">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-6">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-3 px-6 text-sm">
          <span className="rounded-full border border-white/15 px-3.5 py-1.5 text-paper/80">English</span>
          <span className="rounded-full border border-white/15 px-3.5 py-1.5 text-paper/80">INR / PKR</span>
          <span className="rounded-full border border-white/15 px-3.5 py-1.5 text-paper/80">India &amp; Pakistan</span>
        </div>
      </div>
      <div className="bg-black/20 py-6 text-center text-xs text-paper/50">
        <div className="mb-3 flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link href="/info/conditions-of-use" className="hover:underline">Conditions of Use</Link>
          <Link href="/info/privacy-notice" className="hover:underline">Privacy Notice</Link>
          <Link href="/info/interest-based-ads" className="hover:underline">Interest-Based Ads</Link>
        </div>
        8x Marketplace. Demo catalog and test-mode payment flow.
      </div>
    </footer>
  );
}
