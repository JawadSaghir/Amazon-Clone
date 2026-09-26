import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

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

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/dashboard");
  }

  return (
    <div className="page-shell grid gap-6 px-4 py-8 sm:px-8 lg:grid-cols-[240px_1fr]">
      <aside className="card h-fit p-4">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-basil">Account</p>
        <nav className="mt-4 grid gap-1 text-sm font-semibold text-inkSoft">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-lg px-3 py-2.5 hover:bg-paper hover:text-coal">
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  );
}
