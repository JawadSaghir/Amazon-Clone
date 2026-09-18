import Link from "next/link";

const links = [
  ["Overview", "/admin"],
  ["Products", "/admin/products"],
  ["Orders", "/admin/orders"],
  ["Users", "/admin/users"]
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
