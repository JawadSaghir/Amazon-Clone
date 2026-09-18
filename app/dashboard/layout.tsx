import Link from "next/link";

const links = [
  ["Overview", "/dashboard"],
  ["Orders", "/dashboard/orders"],
  ["Addresses", "/dashboard/addresses"],
  ["Wishlist", "/dashboard/wishlist"],
  ["Profile", "/dashboard/profile"],
  ["Notifications", "/dashboard/notifications"],
  ["Payments", "/dashboard/payments"],
  ["Security", "/dashboard/security"]
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-shell grid gap-6 py-8 lg:grid-cols-[230px_1fr]">
      <aside className="panel h-fit p-4">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-basil">Account</p>
        <nav className="mt-4 grid gap-2 text-sm font-bold">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="px-3 py-2 hover:bg-coal/5">
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  );
}
