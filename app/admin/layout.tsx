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
    <div className="page-shell grid gap-6 py-8 lg:grid-cols-[230px_1fr]">
      <aside className="panel h-fit bg-coal p-4 text-paper">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-saffron">Admin</p>
        <nav className="mt-4 grid gap-2 text-sm font-bold">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="px-3 py-2 hover:bg-white/10">
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  );
}
