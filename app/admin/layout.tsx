import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

const links = [
  ["Overview", "/admin"],
  ["Products", "/admin/products"],
  ["Orders", "/admin/orders"],
  ["Users", "/admin/users"]
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (session?.user.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <div className="page-shell grid gap-6 px-4 py-8 sm:px-8 lg:grid-cols-[240px_1fr]">
      <aside className="h-fit rounded-2xl bg-coal p-4 text-paper">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-amazonGold">Admin</p>
        <nav className="mt-4 grid gap-1 text-sm font-semibold">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-lg px-3 py-2.5 hover:bg-white/10">
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  );
}
