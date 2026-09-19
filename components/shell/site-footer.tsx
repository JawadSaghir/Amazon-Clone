import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-10 bg-amazonBlue text-white">
      <Link href="#" className="block bg-amazonLight py-3 text-center text-sm font-bold hover:bg-[#485769]">
        Back to top
      </Link>
      <div className="mx-auto grid max-w-[1000px] gap-8 px-6 py-10 sm:grid-cols-4">
        {[
          ["Get to Know Us", "About 8x", "Careers", "Press Releases", "8x Labs"],
          ["Connect with Us", "Facebook", "Twitter", "Instagram"],
          ["Make Money with Us", "Sell on 8x", "Fulfilment by 8x", "Advertise Your Products"],
          ["Let Us Help You", "Your Account", "Returns Centre", "Payments", "Help"]
        ].map(([title, ...links]) => (
          <div key={title}>
            <h3 className="font-bold text-white">{title}</h3>
            <div className="mt-3 grid gap-2 text-[13px] text-slate-300">
              {links.map((link) => (
                <Link key={link} href="#" className="hover:text-paper">
                  {link}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-y border-white/10 py-6">
        <div className="mx-auto flex max-w-[1000px] flex-wrap items-center justify-center gap-4 text-sm">
          <Link href="/" className="text-2xl font-black">
            8x<span className="text-saffron">market</span>
          </Link>
          <span className="rounded border border-slate-500 px-3 py-1.5">English</span>
          <span className="rounded border border-slate-500 px-3 py-1.5">INR / PKR</span>
          <span className="rounded border border-slate-500 px-3 py-1.5">India & Pakistan</span>
        </div>
      </div>
      <div className="bg-amazonNavy py-6 text-center text-xs text-slate-400">
        <div className="mb-3 flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link href="#" className="hover:underline">Conditions of Use</Link>
          <Link href="#" className="hover:underline">Privacy Notice</Link>
          <Link href="#" className="hover:underline">Interest-Based Ads</Link>
        </div>
        8x Marketplace. Demo catalog and test-mode payment flow.
      </div>
    </footer>
  );
}
