import Link from "next/link";

const footerGroups = [
  {
    title: "Get to Know Us",
    links: [
      ["About 8x", "/info/about-8x"],
      ["Careers", "/info/careers"],
      ["Press Releases", "/info/press-releases"],
      ["8x Labs", "/info/8x-labs"]
    ]
  },
  {
    title: "Connect with Us",
    links: [
      ["Facebook", "/info/facebook"],
      ["Twitter", "/info/twitter"],
      ["Instagram", "/info/instagram"]
    ]
  },
  {
    title: "Make Money with Us",
    links: [
      ["Sell on 8x", "/info/sell-on-8x"],
      ["Fulfilment by 8x", "/info/fulfilment-by-8x"],
      ["Advertise Your Products", "/info/advertise-your-products"]
    ]
  },
  {
    title: "Let Us Help You",
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
    <footer className="mt-0 bg-amazonBlue text-white">
      <Link href="#top" className="block bg-amazonLight py-3 text-center text-sm font-bold hover:bg-[#485769]">
        Back to top
      </Link>
      <div className="mx-auto grid max-w-[1000px] gap-8 px-6 py-10 sm:grid-cols-4">
        {footerGroups.map(({ title, links }) => (
          <div key={title}>
            <h3 className="font-bold text-white">{title}</h3>
            <div className="mt-3 grid gap-2 text-[13px] text-slate-300">
              {links.map(([label, href]) => (
                <Link key={href} href={href} className="hover:text-paper">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-y border-white/10 py-6">
        <div className="mx-auto flex max-w-[1000px] flex-wrap items-center justify-center gap-4 text-sm">
          <Link href="/" className="text-2xl font-black">
            8x<span className="text-saffron">bazaar</span>
          </Link>
          <span className="rounded border border-slate-500 px-3 py-1.5">English</span>
          <span className="rounded border border-slate-500 px-3 py-1.5">INR / PKR</span>
          <span className="rounded border border-slate-500 px-3 py-1.5">India & Pakistan</span>
        </div>
      </div>
      <div className="bg-amazonNavy py-6 text-center text-xs text-slate-400">
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
