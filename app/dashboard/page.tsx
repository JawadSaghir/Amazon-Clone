import { getServerSession } from "next-auth";
import Link from "next/link";

import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="card p-6">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-basil">Dashboard</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-coal">Hello, {session?.user.name ?? "shopper"}</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Tile title="Orders" href="/dashboard/orders" />
        <Tile title="Wishlist" href="/dashboard/wishlist" />
        <Tile title="Addresses" href="/dashboard/addresses" />
      </div>
    </div>
  );
}

function Tile({ title, href }: { title: string; href: string }) {
  return (
    <Link href={href} className="rounded-xl border border-line bg-paper p-5 font-semibold text-coal hover:border-amazonOrange hover:bg-accentTint">
      {title}
    </Link>
  );
}
